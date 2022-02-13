import { ISoftDeletable } from './softDeletable';

export interface IUser extends ISoftDeletable {
  email: string;
  first_name: string;
  last_name: string;
  accounts: [{ acc_type: string; uid: string }];
}
