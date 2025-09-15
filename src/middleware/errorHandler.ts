import { NextFunction, Request, Response } from 'express';

export default function errorHandler(
	err: Error,
	_req: Request,
	res: Response,
	_next: NextFunction
): void {
	console.error(err.stack || err.message);
	res.status(500).json({ error: 'Internal Server Error' });
}
