import mongoose from 'mongoose';
import 'dotenv/config';
import { connectDatabase } from './services/database.service';
import authRoutes from './routes/auth.route';
import { setupAuthentication } from './authentication';
import app from './app';

const db = mongoose.connection;

const port: number | string = process.env.PORT || 3000;

connectDatabase();

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', (): void => {
  console.log('Connected successfully');
});

app.listen(port, (): void => console.log('Listening on Port 3000'));
