import { Router } from 'express';
import User from '../models/user.model';
import { signToken } from '../helpers/token';
import { authUser, authUserNotStrict } from '../middleware/auth';
const router = Router();

router.get('/me', authUser, async (req, res) => {
	res.json(await User.findById(req.userId).select('-_id'));
});

router.post('/register', async (req, res) => {
	try {
		const name: string = req.body.name;

		const newUser = await new User({
			name
		}).save();

		const jwtToken = signToken(newUser);

		res.json({ token: jwtToken });
	} catch (err) {
		res.status(500).json({ message: err.message, error: err });
	}
});

router.get('/now', (req, res) => {
	res.json({ timestamp: new Date().getTime() });
});

router.get('/leaderboards', authUserNotStrict, async (req, res) => {
	const isSignedIn = !!req.userId;

	const [leaders, me] = await Promise.all([
		User.aggregate([
			{ $sort: { points: -1 } },
			{ $limit: 10 },
			{ $project: { name: true, points: true, _id: false } }
		]),
		isSignedIn ? User.findById(req.userId).select('-_id points name') : null
	]);

	for (let i = 0; i < leaders.length; i++) {
		leaders[i].place = i + 1;
	}

	/* Check i'm in the top 10, in which case it's not required to make another trip to
    the DB to get my place/rank */
	const meInTop10 = leaders.find(el => el.name === me.name);

	// Since the "points" field is indexed, a "count()" should be fairly efficient
	const myPlace = isSignedIn
		? meInTop10
			? meInTop10.points
			: (await User.count({ points: { $gt: me.place } })) + 1
		: null;

	res.json({
		leaders,
		...(isSignedIn ? { current_user_place: myPlace } : {})
	});
});

export default router;
