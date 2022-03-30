import { Schema } from 'mongoose';
import { ISoftDeletable } from './softDeletable';

// Type representing a profile object in the db
export interface IProfile extends ISoftDeletable {
  _id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  username: string;
  bio: string;
  photo: { data: Buffer; contentType: String };
}
