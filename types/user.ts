export interface IUser {
  email: string;
  first_name: string;
  last_name: string;
  accounts: [{ acc_type: string; uid: string }];
  deleted: boolean;
  schema_version: string;
}
