import { Schema } from 'mongoose';

// Type returned when making a GET request to profile api
export interface GETProfile {
  user_id: Schema.Types.ObjectId;
  username: string;
  bio: string;
}

// Type given to profile api in POST requests
export interface POSTCreateProfile {
  user_id: Schema.Types.ObjectId;
  username: string;
  bio?: string;
  photo?: { data: Buffer; contentType: String };
}
