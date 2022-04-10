import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import 'dotenv/config';
import profiles from './routes/profile.route';
import authRoutes from './routes/auth.route';
import { setupAuthentication } from './authentication';
import fileUpload from 'express-fileupload';

const app: Application = express();

// Express config
app.use(cors());
app.use(express.json());

// set up authentication middleware
setupAuthentication(app);

app.use(fileUpload());

/* ROUTES */

// base route
app.get('/', (req: Request, res: Response): void => {
  res.send({ greeting: 'Hello world!' });
});

// add routes for profile API
app.use('/api/v1/profiles', profiles);

// add authentication routes (e.g. via Google, etc.)
app.use('/auth', authRoutes);

export default app;
