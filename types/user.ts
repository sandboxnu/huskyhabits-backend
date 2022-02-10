import { IBaseType } from './baseType';

export interface IUser extends IBaseType {
  email: string;
  first_name: string;
  last_name: string;
  accounts: [{ acc_type: string; uid: string }];
}
