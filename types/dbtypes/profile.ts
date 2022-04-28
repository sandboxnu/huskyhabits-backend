import { Schema } from 'mongoose';
import { ISoftDeletable } from './softDeletable';

// Type corresponding to a profile photo in the db
export type ProfilePhoto = {
  data: Buffer;
  contentType: String;
};

// Type representing a profile object in the db
interface IProfile extends ISoftDeletable {
  _id: Schema.Types.ObjectId;
  user_id: Schema.Types.ObjectId;
  name: string;
  username: string;
  bio: string;
  photo: ProfilePhoto;
}

export default IProfile;
