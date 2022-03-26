import mongoose from 'mongoose';
import 'dotenv/config';
import { connectDatabase } from './services/database.service';
import { addAuthenticationRoutes } from './passport';
import app from './app';

const db = mongoose.connection;

const port: number | string = process.env.PORT || 3000;

connectDatabase();

db.on('error', console.error.bind(console, 'connection error: '));

db.once('open', (): void => {
  console.log('Connected successfully');
});

addAuthenticationRoutes(app);

app.listen(port, (): void => console.log('Listening on Port 3000'));
