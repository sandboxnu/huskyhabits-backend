import { Schema } from 'mongoose';
import { IBaseType } from './baseType';

export interface IProfile extends IBaseType {
  user_id: Schema.Types.ObjectId;
  username: string;
  bio: string;
  photo: { data: Buffer; contentType: String };
}
