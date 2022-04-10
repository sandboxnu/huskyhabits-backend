import { Schema } from 'mongoose';
import { JSONSchemaType } from 'ajv';
import { IChallenge } from '../dbtypes/challenge';
import IProfile from '../dbtypes/profile';

// Gets all challenges in database.
export interface GETAllChallenges {
  challenges: IChallenge[]
}


// Type returned when making a GET request to challenge api
export interface GETChallenge extends IChallenge {

}

// Post a new challenge
export interface POSTChallenge {
  challenge_id: Schema.Types.ObjectId;
  name: string;
  start_date: Date;
  duration: number; 
  participants: IProfile["_id"][];
  owner: IProfile["_id"];
}