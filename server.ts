import express, { Request, Response, Application } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import test from './routes/test.route';
import profiles from './routes/profiles.route';
import { connectDatabase } from './services/database.service';

const app: Application = express();
const db = mongoose.connection;
const port: number | string = process.env.PORT || 3000;

connectDatabase();

// Express config
app.use(cors());
app.use(express.json());

/* ROUTES */

// base route
app.get('/', (req: Request, res: Response): void => {
  res.send({ greeting: 'Hello world!' });
});

app.use('/api/test', test);
app.use('/api/v1/profiles', profiles);

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', (): void => {
  console.log('Connected successfully');
});

app.listen(port, (): void => console.log('Listening on Port 3000'));
