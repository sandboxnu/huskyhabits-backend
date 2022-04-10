import { GETProfile, POSTCreateProfile } from '../types/apitypes/profile';
import ProfileModel from '../dbmodels/profile';
import { IProfile } from '../types/dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';
import { GETAllChallenges, GETChallenge, POSTChallenge } from '../types/apitypes/challenge';
import { createChallenge, getAllChallenges, getChallenge } from '../repositories/challenge';
import { Controller, Get, Path, Patch, Post, Query, Route, Body } from 'tsoa';


@Route("challenges")
export class ChallengeController extends Controller {
    // Gets all challenges, with option to query by name
    @Get("")
    public async get_all_challenges(
        @Query() name?: string
    ): Promise<GETAllChallenges> {
        const challenges = await getAllChallenges(name);
    
        return { challenges: challenges };
    };

    // Gets a challenge from a challenge id
    @Get("{id}")
    public async get_challenge(
        @Path() id: string
    ): Promise<GETChallenge> {
        const challenge = await getChallenge(id);
        return challenge;
    };

    // Creates and returns a new challenge
    @Post("/")
    public async post_challenge(
        @Body() name: string, start_date: string, duration: number, owner: IProfile["_id"] 
    ): Promise<POSTChallenge> {
        const challenge = await createChallenge(name, start_date, duration, owner);
        return challenge;
    };
}
