import UserSchema from '../models/user';
import { IUser } from '../types/user';

exports.get_or_create_user = async (
  email: string,
  first_name: string,
  last_name: string,
): Promise<IUser> => {
  return UserSchema.findOne({ email: email }).then((result: IUser | null) => {
    if (!result) {
      return UserSchema.create({
        email: email,
        first_name: first_name,
        last_name: last_name,
      });
    }

    return result;
  });
};
