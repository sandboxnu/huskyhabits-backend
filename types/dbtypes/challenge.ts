import { Schema } from 'mongoose';
import { IProfile } from './profile';
import { ISoftDeletable } from './softDeletable';

// TODO: soft-delete?
export interface IChallenge extends ISoftDeletable {
  challenge_id: Schema.Types.ObjectId;
  name: string;
  start_date: Date;
  duration: number; // number of days
  participants: IProfile["_id"][]; // list of profile ids
  owner: IProfile["_id"];
}

