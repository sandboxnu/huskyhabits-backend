import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import 'dotenv/config';
import users from './routes/user';
import profiles from './routes/profile';
import authRoutes from './routes/auth';
import { setupAuthentication } from './authentication';
import fileUpload from 'express-fileupload';

const app: Application = express();

// Express config
app.use(cors({ credentials: true }));
app.use(express.json());

// set up authentication middleware
setupAuthentication(app);

app.use(fileUpload());

// store user data
// res.locals.user = req.user || null
// next();

/* ROUTES */

// base route
app.get('/', (req: Request, res: Response): void => {
  res.send({ greeting: 'Hello world!' });
});

// Profile API
app.use('/api/v1/users', users);

// Profile API
app.use('/api/v1/profiles', profiles);

// add authentication routes (e.g. via Google, etc.)
app.use('/auth', authRoutes);

export default app;
