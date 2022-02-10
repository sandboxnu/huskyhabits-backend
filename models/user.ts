import { model, Schema } from 'mongoose';
import { IUser } from '../types/user';

// A logged-in User to Husky Habits
const userSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true },
    first_name: String,
    last_name: String,
    accounts: [{ acc_type: String, uid: String }],
    deleted: { type: Boolean, default: false },
    schema_version: String,
  },
  { timestamps: true },
);

export default model<IUser>('User', userSchema);
