import { Router } from 'express';
import User from '../models/user.model';
import { signToken } from '../helpers/token';
import { authUser } from '../middleware/auth';

const router = Router();

router.post('/register', async (req, res) => {
	try {
		const name: string = req.body.name;

		const newUser = await new User({
			name
		}).save();

		const jwtToken = signToken(newUser);

		res.send(jwtToken);
	} catch (err) {
		res.status(500).json({ message: err.message, error: err });
	}
});

router.get('/me', authUser, async (req, res) => {
	res.send(await User.findById(req.userId));
});

export default router;
