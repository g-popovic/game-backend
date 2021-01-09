import { IUser } from '../models/user.model';
import jwt from 'jsonwebtoken';

interface TokenContent {
	id: string;
}

// Get a JWT token containing the users ID
export function signToken(user: IUser): string {
	const payload: TokenContent = {
		id: user._id
	};

	const token = jwt.sign(payload, process.env.JWT_SECRET!);
	console.log(token);
	return token;
}

// Returns the decrypted version of the token OR null if the token isn't valid
export function decryptToken(token: string): TokenContent | null {
	try {
		return <TokenContent>jwt.verify(token, process.env.JWT_SECRET!);
	} catch (err) {
		return null;
	}
}
