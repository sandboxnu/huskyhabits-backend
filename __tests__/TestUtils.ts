import mongoose from 'mongoose';
import 'dotenv/config';
import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import 'dotenv/config';
import profiles from '../routes/profiles.route';
//import profiles from './routes/profiles.route';

export const connectTestDatabase = async () => {
  const mongoDB: string = `${process.env.DATABASE}-test` || '';

  try {
    // connect to MongoDB
    await mongoose.connect(mongoDB);
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

const app: Application = express();
const db = mongoose.connection;

const port: number | string = process.env.PORT || 3000;

connectTestDatabase();

// Express config
app.use(cors());
app.use(express.json());

/* ROUTES */

// base route
app.get('/', (req: Request, res: Response): void => {
  res.send({ greeting: 'Hello world!' });
});

app.use('/api/v1/profiles', profiles);

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', (): void => {
  console.log('Connected successfully');
});

module.exports = app;
