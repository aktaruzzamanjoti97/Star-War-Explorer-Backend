import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import errorHandler from './middleware/errorHandler';
import peopleRoutes from './routes/peopleRoutes';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.use('/api', peopleRoutes);

app.get('/', (_req: Request, res: Response) => {
	res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

export default app;
