import { Schema } from 'mongoose';
import ChallengeModel from '../dbmodels/challenge';
import { IChallenge } from '../types/dbtypes/challenge';
import HTTPError from '../exceptions/HTTPError';
import challenge from '../dbmodels/challenge';

// Query all challenges and have a search parameter to filter by matching challenge name
export const getAllChallenges = async (
    name?: string
): Promise<IChallenge[]> => {
    const filter = name ? { "name": { "$regex" : name } } :  {};
    const result: IChallenge[] = await ChallengeModel.find(filter);
    return result;
}

export const getChallenge = (id: string) => {

}

export const createChallenge = () => {

}

export const getMembersForChallenge = (id: string) => {

}

export const addMemberToChallenge = (id: string, user_id: Schema.Types.ObjectId) => {

}

