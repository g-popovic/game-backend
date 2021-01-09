import { Router } from 'express';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';

const router = Router();

router.post('/register', async (req, res) => {
	try {
		const name: string = req.body.name;

		const newUser = new User({
			name
		});

		res.send(await newUser.save());
	} catch (err) {
		res.status(500).send(err);
	}
});

export default router;
