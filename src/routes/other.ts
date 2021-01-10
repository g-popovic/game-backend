import { Router } from 'express';
import User from '../models/user.model';
import { signToken } from '../helpers/token';
import { authUser } from '../middleware/auth';
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

router.get('/leaderboards', (req, res) => {
	res.send('Work in progress');
});

export default router;
