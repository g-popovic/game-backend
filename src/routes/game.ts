import { Router } from 'express';
import { authUser } from '../middleware/auth';
import User from '../models/user.model';
const router = Router();

router.post('/play', authUser, async (req, res) => {
	const points = Math.ceil(Math.random() * 100);
	const lastHour = new Date();
	lastHour.setMinutes(0, 0, 0);
	const maxGamesPerHour = 5;

	const result = await User.findOneAndUpdate(
		{
			_id: req.userId,
			$expr: {
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
			$push: { recentGameDates: new Date() },
			$pull: { $lt: lastHour }
		}
	);

	if (!result) return res.status(403).send('Max requests this hour reached');

	res.json({
		points_added: points,
		points_total: points + result.points
	});
});

router.post('/claim_bonus', authUser, async (req, res) => {
	res.sendStatus(200);
});

export default router;
