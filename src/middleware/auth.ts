import { NextFunction, Request, Response } from 'express';
import { decryptToken } from '../helpers/token';

// Auth token should be prefixed with "Bearer " (e.g. "Bearer mytoken123")
export function authUser(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];
	const token = authHeader?.split(' ')[1];

	// If token isn't present return 400
	if (!token) return res.status(400).send('Token not found');

	const decrypted = decryptToken(token);

	// If !decrypted means token isn't valid
	if (!decrypted) return res.status(401).send('Invalid token');

	req.userId = decrypted.id;
	next();
}
