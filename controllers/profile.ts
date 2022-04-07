import { GETProfile, POSTCreateProfile } from '../types/apitypes/profile';
import ProfileModel from '../dbmodels/profile';
import { IProfile } from '../types/dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';
import { IUser } from '../types/dbtypes/user';
import {
  get_profile_by_id,
  create_profile,
  save_profile,
  get_profiles_by_user_id,
} from '../repositories/profile';
import { Schema } from 'mongoose';

// Get the profile with the given id
export const profile_get = async (id: string): Promise<GETProfile> => {
  let doc = await get_profile_by_id(id);

  return {
    _id: doc._id,
    user_id: doc.user_id,
    username: doc.username,
    bio: doc.bio,
  };
};

// Get a profile with the given user_id
export const profile_get_by_user_id = async (
  user_id: Schema.Types.ObjectId,
): Promise<GETProfile> => {
  let docs = await get_profiles_by_user_id(user_id);

  if (!docs) {
    const err = new HTTPError('Profile not found', 404);
    return Promise.reject(err);
  }

  return {
    _id: docs[0]._id,
    user_id: docs[0].user_id,
    username: docs[0].username,
    bio: docs[0].bio,
  };
};

// Create a profile with the provided info
export const profile_post = (
  profile: POSTCreateProfile,
  user: IUser,
): Promise<IProfile> => {
  return create_profile(profile.username, profile.bio, user._id);
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
