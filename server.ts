import mongoose from 'mongoose';
import 'dotenv/config';
import { connectDatabase } from './services/database.service';
import authRoutes from './routes/auth';
import { setupAuthentication } from './authentication';
import app from './app';

const db = mongoose.connection;

const port: number | string = process.env.PORT || 3000;

connectDatabase();

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', (): void => {
  console.log('Connected successfully');
});

// set up authentication middleware
setupAuthentication(app);

// add authentication routes (e.g. via Google, etc.)
app.use('/auth', authRoutes);

app.listen(port, (): void => console.log('Listening on Port 3000'));
