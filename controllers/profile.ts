import { GETProfile, POSTCreateProfile } from '../apitypes/profile';
import ProfileModel from '../dbmodels/profile';
import { IProfile } from '../dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';

// Gets a profile with the given id
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

// Creates a profile with the provided info
exports.create_profile = async (
  profile: POSTCreateProfile,
): Promise<IProfile> => {
  const created = new ProfileModel(profile);

  return await created.save();
};
