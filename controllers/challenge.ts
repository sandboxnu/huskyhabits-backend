import { query } from 'express';
import { Controller, Delete, Get, Path, Post, Route, Query } from 'tsoa';
import { GETChallenge } from '../types/apitypes/challenge';

@Route('challenges')
export class ChallengesController extends Controller {
  @Get('')
  public async getChallenges(
    @Query() name?: string,
  ): Promise<GETChallenge | undefined> {
    return undefined;
  }
}
