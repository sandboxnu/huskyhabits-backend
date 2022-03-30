import { Document, Query } from 'mongoose';
import ProfileModel from '../dbmodels/profile';
import { IProfile } from '../types/dbtypes/profile';

// Gets a profile by id
export const get_profile_by_id = async (
  id: string,
): Promise<IProfile | null> => {
  return await ProfileModel.findById(id);
};

// Saves the given profile to the database
export const save_profile = (
  profile: Document & IProfile,
): Promise<IProfile> => {
  return profile.save();
};
