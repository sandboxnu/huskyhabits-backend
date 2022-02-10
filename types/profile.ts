import { Schema } from 'mongoose';

export interface IProfile {
  user_id: Schema.Types.ObjectId;
  username: string;
  bio: string;
  photo: string;
}
