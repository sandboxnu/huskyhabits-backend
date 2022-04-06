import { Schema } from 'mongoose';
import { IProfile } from './profile';

// TODO: soft-delete?
export interface IChallenge {
  challenge_id: Schema.Types.ObjectId;
  name: string;
  start_date: Date;
  duration: number; // number of days
  participants: IProfile["_id"][]; // list of profile ids
  owner: IProfile["_id"];
}

