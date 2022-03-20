import { GETProfile } from '../apitypes/profile';
import ProfileModel from '../dbmodels/profile';
import HTTPError from '../exceptions/HTTPError';

exports.get_profile = async (user_id: string): Promise<GETProfile> => {
  let doc = await ProfileModel.findOne({ user_id: user_id });

  if (!doc) {
    const err = new HTTPError('Profile not found', 404);

    return Promise.reject(err);
  }

  return {
    user_id: doc.user_id,
    username: doc.username,
    bio: doc.bio,
  };
};
