import { model, Schema } from 'mongoose';
import { IProfile } from '../types/profile';

// A Profile for a User
const profileSchema: Schema = new Schema<IProfile>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    username: String,
    bio: String,
    photo: String,
  },
  { timestamps: true },
);
