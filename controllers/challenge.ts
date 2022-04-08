import { GETProfile, POSTCreateProfile } from '../types/apitypes/profile';
import ProfileModel from '../dbmodels/profile';
import { IProfile } from '../types/dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';
import { GETAllChallenges } from '../types/apitypes/challenge';
import { getAllChallenges } from '../repositories/challenge';
import { Controller, Get, Path, Patch, Post, Query, Route } from 'tsoa';


@Route("challenges")
export class ChallengeController extends Controller {
    // Gets all challenges, with option to query by name
    @Get("")
    public async gets_all_challenges(
        @Query() name?: string
    ): Promise<GETAllChallenges> {
        const challenges = await getAllChallenges(name);
    
        return { 
        challenges: challenges 
        };
    };
}
