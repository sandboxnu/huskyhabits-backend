import express, { Request, Response, Application } from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/auth.route';
import { setupAuthentication } from './authentication';
import fileUpload from 'express-fileupload';
import router from './routes';

const app: Application = express();

// Express config
app.use(cors());
app.use(express.json());

// set up authentication middleware
setupAuthentication(app);

let baseUrl = '/api/v1';

app.use(fileUpload());

/* ROUTES */

// base route
app.get('/', (req: Request, res: Response): void => {
  res.send({ greeting: 'Hello world!' });
});

// add all API v1 routes
app.use(baseUrl, router)

// add authentication routes (e.g. via Google, etc.)
app.use('/auth', authRoutes);

export default app;
