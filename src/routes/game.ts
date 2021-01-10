import { Router } from 'express';
import { authUser } from '../middleware/auth';
import User from '../models/user.model';
import mongoose from 'mongoose';
const router = Router();

router.post('/play', authUser, async (req, res) => {
	const points = Math.ceil(Math.random() * 100);
	const lastHour = new Date();
	lastHour.setMinutes(0, 0, 0);
	const maxGamesPerHour = 5;

	const user = await User.findOneAndUpdate(
		{
			_id: req.userId,
			$expr: {
				// This makes sure there are less then 5 games played in the last hour
				$lt: [
					{
						$size: {
							$filter: {
								input: '$recentGameDates',
								as: 'recentGameDate',
								cond: { $gte: ['$$recentGameDate', lastHour] }
							}
						}
					},
					maxGamesPerHour
				]
			}
		},
		{
			$inc: { points },
			$push: { recentGameDates: new Date() }
		}
	);

	if (!user) return res.status(403).send('Max requests this hour reached');

	res.json({
		points_added: points,
		points_total: points + user.points
	});

	// This gets rid of the old games which are no longer needed
	User.updateOne(
		{
			_id: req.userId
		},
		{
			$pull: { recentGameDates: { $lte: lastHour } }
		}
	);
});

router.post('/claim_bonus', authUser, async (req, res) => {
	const oneMinuteAgo = new Date(new Date().getTime() - 60 * 1000);

	const user = await User.findOneAndUpdate(
		{ _id: req.userId, lastBonusClaim: { $lte: oneMinuteAgo } },
		{ $set: { lastBonusClaim: new Date() } }
	);

	if (!user) return res.status(403).send('Please wait at least a minute');

	// (difference in ms / 60000) * 10 === 10 points per minute
	const points = Math.min(
		Math.floor((new Date().getTime() - user.lastBonusClaim) / 60000) * 10,
		100
	);

	await User.updateOne({ _id: req.userId }, { $inc: { points: points } });

	res.json({
		points_added: points,
		points_total: user.points + points
	});
});

export default router;
