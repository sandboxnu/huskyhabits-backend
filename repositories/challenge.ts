import { Schema } from 'mongoose';
import ChallengeModel from '../dbmodels/challenge';
import { IChallenge } from '../types/dbtypes/challenge';
import HTTPError from '../exceptions/HTTPError';
import challenge from '../dbmodels/challenge';
import { IProfile } from '../types/dbtypes/profile';
import { POSTChallenge } from '../types/apitypes/challenge';

// Query all challenges and have a search parameter to filter by matching challenge name
export const getAllChallenges = async (
    name?: string
): Promise<IChallenge[]> => {
    const filter = name ? { "name": { "$regex" : name } } :  {};
    const result: IChallenge[] = await ChallengeModel.find(filter);
    return result;
}

export const getChallenge = async (id: string): Promise<IChallenge> => {
    const challenge: IChallenge | null = await ChallengeModel.findById(id);
    if (!challenge) return Promise.reject(new HTTPError('Challenge not found', 404));
    return challenge;
}

export const createChallenge = async (
    name: string, 
    start_date: string, // convert string date to Date object
    duration: number, 
    owner: IProfile["_id"]
): Promise<IChallenge> => {
    try {
        const startDate = new Date(start_date);
        const challenge: IChallenge | null = await ChallengeModel.create({
            name,
            start_date: startDate,
            duration,
            owner,
        });
        return challenge;
    } catch (e: any) {
        console.log(e);
        return Promise.reject(new HTTPError('Error in creating a challenge.', 500));
    }

}

export const getMembersForChallenge = (id: string) => {

}

export const addMemberToChallenge = (id: string, user_id: Schema.Types.ObjectId) => {

}

