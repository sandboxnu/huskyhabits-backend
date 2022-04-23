import HTTPError from '../exceptions/HTTPError';
import { Schema } from 'mongoose';
import { get_user_by_id } from '../repositories/user';
import { GETUser } from '../types/apitypes/user';

export class UserController {
  // Get the user with the given id
  public user_get = async (id: Schema.Types.ObjectId): Promise<GETUser> => {
    let doc = await get_user_by_id(id);

    if (!doc) {
      const err = new HTTPError('User not found', 404);
      return Promise.reject(err);
    }

    return {
      _id: doc._id,
      email: doc.email,
      first_name: doc.first_name,
      last_name: doc.last_name,
    };
  };
}
