// Auth token should be prefixed with "Bearer " (e.g. "Bearer mytoken123")
import { NextFunction, Request, Response } from 'express';
import { decryptToken } from '../helpers/token';

// Sets req.userId to the ID from the token. Only calls "next()" when token is valid
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

// Same as authUser, however "next()" regardless if token is present or valid
export function authUserNotStrict(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];
	const token = authHeader?.split(' ')[1];

	const decrypted = token ? decryptToken(token) : null;
	if (decrypted) {
		req.userId = decrypted.id;
	}

	next();
}
