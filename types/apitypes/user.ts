import { Schema } from 'mongoose';

// Type returned when making a GET request to user api
export interface GETUser {
  _id: Schema.Types.ObjectId;
  email: string;
  first_name: string;
  last_name: string;
}
