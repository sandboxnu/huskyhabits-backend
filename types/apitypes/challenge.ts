import { Schema } from 'mongoose';
import { JSONSchemaType } from 'ajv';
import { IChallenge } from '../dbtypes/challenge';

// Gets all challenges in database.
export interface GETAllChallenges {
  challenges: IChallenge[]
}


// Type returned when making a GET request to challenge api
export interface GETChallenge extends IChallenge {

}