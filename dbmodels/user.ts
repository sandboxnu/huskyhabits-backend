import { model, Schema } from 'mongoose';
import { IUser } from '../dbtypes/user';

// A logged-in User to Husky Habits
const userSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    first_name: String,
    last_name: String,
    accounts: [{ acc_type: String, uid: String }],
    deleted: { type: Boolean, default: false },
    date_deleted: Date,
    schema_version: { type: Number, default: 1 },
  },
  { timestamps: true },
);

export default model<IUser>('User', userSchema);
