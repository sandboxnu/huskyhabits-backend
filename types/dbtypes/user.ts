import { ISoftDeletable } from './softDeletable';

// Type representing a user object in the db
export interface IUser extends ISoftDeletable {
  email: string;
  first_name: string;
  last_name: string;
  accounts: [{ acc_type: string; uid: string }];
}
