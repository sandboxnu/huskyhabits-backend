import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import 'dotenv/config';
import profiles from './routes/profile';

const app: Application = express();

// Express config
app.use(cors());
app.use(express.json());

/* ROUTES */

// base route
app.get('/', (req: Request, res: Response): void => {
  res.send({ greeting: 'Hello world!' });
});

app.use('/api/v1/profiles', profiles);

export default app;
