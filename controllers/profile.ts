import { GETProfile, POSTCreateProfile } from '../types/apitypes/profile';
import ProfileModel from '../dbmodels/profile';
import { IProfile } from '../types/dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';
import { IUser } from '../types/dbtypes/user';
import { get_profile_by_id, save_profile } from '../repositories/profile';

// Get the profile with the given id
export const get_profile = async (id: string): Promise<GETProfile> => {
  let doc = await get_profile_by_id(id);

  if (!doc) {
    const err = new HTTPError('Profile not found', 404);
    return Promise.reject(err);
  }

  return {
    _id: doc._id,
    user_id: doc.user_id,
    username: doc.username,
    bio: doc.bio,
  };
};

// Create a profile with the provided info
export const create_profile = (
  profile: POSTCreateProfile,
  user: IUser,
): Promise<IProfile> => {
  const model = new ProfileModel(profile);

  model.user_id = user._id;

  return save_profile(model);
};

// A type corresponding to profile photos in the database
type Photo = {
  data: Buffer;
  contentType: String;
};

// Set the profile photo for the given user
export const set_profile_photo = async (
  profile_id: string,
  photo: Photo,
): Promise<IProfile> => {
  let doc = await get_profile_by_id(profile_id);

  if (!doc) {
    const err = new HTTPError('Profile not found', 404);
    return Promise.reject(err);
  }

  doc.photo = photo;

  return save_profile(new ProfileModel(doc));
};

// Retreive the profile photo for the specified user
export const get_profile_photo = async (profile_id: string): Promise<Photo> => {
  let doc = await get_profile_by_id(profile_id);

  if (!doc) {
    const err = new HTTPError('Profile not found', 404);
    return Promise.reject(err);
  }

  return doc.photo;
};
