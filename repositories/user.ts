import UserSchema from '../dbmodels/user';
import HTTPError from '../exceptions/HTTPError';
import { IUser } from '../types/dbtypes/user';
import { Schema } from 'mongoose';

export const get_or_create_user = async (
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

export const get_user_by_id = async (
  id: Schema.Types.ObjectId,
): Promise<IUser> => {
  return UserSchema.findById(id).then((result: IUser | null | undefined) => {
    if (!result) {
      return Promise.reject(new HTTPError('User does not exist.', 404));
    }
    return result;
  });
};
