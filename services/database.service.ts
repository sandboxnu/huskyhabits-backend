import mongoose = require('mongoose');
import 'dotenv/config';

export const connectDatabase = async () => {
  const mongoDB: string = process.env.DATABASE || '';

  try {
    // connect to MongoDB
    await mongoose.connect(mongoDB);
  } catch (err: any) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};
