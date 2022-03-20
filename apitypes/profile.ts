import { Schema } from 'mongoose';

export interface GETProfile {
  user_id: Schema.Types.ObjectId;
  username: string;
  bio: string;
}
