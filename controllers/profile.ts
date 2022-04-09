import { GETProfile, POSTCreateProfile } from '../types/apitypes/profile';
import ProfileModel from '../dbmodels/profile';
import IProfile, { ProfilePhoto } from '../types/dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';
import { IUser } from '../types/dbtypes/user';
import {
  get_profile_by_id,
  create_profile,
  save_profile,
  get_profiles_by_user_id,
} from '../repositories/profile';
import { Schema } from 'mongoose';


export class ProfileController {
  // Get the profile with the given id
  public profile_get = async (id: string): Promise<GETProfile> => {
    let doc = await get_profile_by_id(id);

    return {
      _id: doc._id,
      user_id: doc.user_id,
      username: doc.username,
      bio: doc.bio,
    };
  };

  // Get a profile with the given user_id
  public profile_get_by_user_id = async (
    user_id: Schema.Types.ObjectId,
  ): Promise<GETProfile> => {
    let docs = await get_profiles_by_user_id(user_id);

    if (!docs) {
      const err = new HTTPError('User not found', 404);
      return Promise.reject(err);
    }

    if (docs.length == 0) {
      const err = new HTTPError('User has no profiles', 404);
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
  public profile_post = (
    profile: POSTCreateProfile,
    user: IUser,
  ): Promise<IProfile> => {
    return create_profile(profile.username, profile.bio, user._id);
  };

  // Does the profile belong to the specified user?
  public user_owns_profile = async (
    profile_id: string,
    user: IUser,
  ): Promise<boolean> => {
    let doc = await get_profile_by_id(profile_id);

    return doc.user_id.toString() == user._id.toString();
  };

  // Set the profile photo for the given user
  public set_profile_photo = async (
    profile_id: string,
    photo: ProfilePhoto,
  ): Promise<IProfile> => {
    console.log(profile_id);
    let doc = await get_profile_by_id(profile_id);
    console.log(doc);
    if (!doc) return Promise.reject(new HTTPError('Profile not found', 404));

    doc.photo = photo;
    return save_profile(new ProfileModel(doc));
  };

  // Retreive the profile photo for the specified user
  public get_profile_photo = async (profile_id: string): Promise<ProfilePhoto> => {
    let doc = await get_profile_by_id(profile_id);
    if (!doc) return Promise.reject(new HTTPError('Profile not found', 404));
    
    return doc.photo;
  };
}
