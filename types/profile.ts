import { Schema } from 'mongoose';
import { ISoftDeletable } from './softDeletable';

export interface IProfile extends ISoftDeletable {
  user_id: Schema.Types.ObjectId;
  username: string;
  bio: string;
  photo: { data: Buffer; contentType: String };
}
