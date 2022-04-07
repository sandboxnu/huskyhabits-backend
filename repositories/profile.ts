import { Schema, Document } from 'mongoose';
import ProfileModel from '../dbmodels/profile';
import HTTPError from '../exceptions/HTTPError';
import { IProfile } from '../types/dbtypes/profile';

// Gets a profile by id
export const get_profile_by_id = async (id: string): Promise<IProfile> => {
  return await ProfileModel.findById(id).then(
    (result: IProfile | null | undefined) => {
      if (!result) {
        return Promise.reject(new HTTPError('Profile not found', 404));
      }

      return result;
    },
  );
};

// Gets all profile with the given user id
export const get_profiles_by_user_id = async (
  user_id: Schema.Types.ObjectId,
): Promise<IProfile[] | null> => {
  return await ProfileModel.find({ user_id: user_id });
};

// Creates a new profile in the database
export const create_profile = (
  username: string,
  bio: string | undefined,
  user_id: Schema.Types.ObjectId,
): Promise<IProfile> => {
  return ProfileModel.create({
    username: username,
    bio: bio,
    user_id: user_id,
  });
};

// Saves the given profile to the database
export const save_profile = (
  profile: Document & IProfile,
): Promise<IProfile> => {
  return profile.save();
};
