import { model, Schema } from 'mongoose';
import { IProfile } from '../dbtypes/profile';

// A Profile for a User
const profileSchema: Schema = new Schema<IProfile>(
  {
    user_id: { type: Schema.Types.ObjectId, required: true },
    username: { type: String, unique: true },
    bio: String,
    photo: { data: Buffer, contentType: String },
    deleted: { type: Boolean, default: false },
    date_deleted: Date,
    schema_version: { type: Number, default: 1 },
  },
  { timestamps: true },
);

export default model<IProfile>('Profile', profileSchema);
