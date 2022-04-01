import { Schema } from 'mongoose';
import { ISoftDeletable } from './softDeletable';
import { Schema } from 'mongoose';

// Type representing a user object in the db
export interface IUser extends ISoftDeletable {
  _id: Schema.Types.ObjectId;
  email: string;
  first_name: string;
  last_name: string;
  accounts: [{ acc_type: string; uid: string }];
}
