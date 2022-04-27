import { Schema, Document } from 'mongoose';
import ProfileModel from '../dbmodels/profile';
import HTTPError from '../exceptions/HTTPError';
import IProfile from '../types/dbtypes/profile';

// Gets a profile by id
export const get_profile_by_id = async (id: string): Promise<IProfile> => {
  const profile = await ProfileModel.findById(id);
  if (!profile) return Promise.reject(new HTTPError('Profile not found', 404));
  return profile;
};

// Gets all profile with the given user id
export const get_profiles_by_user_id = async (
  user_id: Schema.Types.ObjectId,
): Promise<IProfile[]> => {
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

export const update_profile_details = async (
  profile_id: string,
  first_name: string | undefined,
  last_name: string | undefined,
  username: string | undefined,
  bio: string | undefined,
): Promise<IProfile | null> => {
  return ProfileModel.findByIdAndUpdate(
    { _id: profile_id },
    {
      $set: {
        // conditionally add member to anonymous object
        // Src: https://stackoverflow.com/questions/11704267/in-javascript-how-to-conditionally-add-a-member-to-an-object
        ...(first_name && { first_name: first_name }),
        ...(last_name && { last_name: last_name }),
        ...(username && { username: username }),
        ...(bio && { bio: bio }),
      },
      $currentDate: { lastModified: true },
    },
  );
};
