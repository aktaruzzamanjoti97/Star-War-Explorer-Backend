import cors from 'cors';
import 'dotenv/config';
import express, { Application, Request, Response } from 'express';
import errorHandler from './middleware/errorHandler';
import peopleRoutes from './routes/peopleRoutes';

const app: Application = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', peopleRoutes);

app.get('/', (_req: Request, res: Response) => {
	res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

export default app;
