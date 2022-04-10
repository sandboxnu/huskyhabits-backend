import { Request, Response, Router } from 'express';
import HTTPError from '../exceptions/HTTPError';
import { sendError, sendValidationError } from '../exceptions/utils';
import { ajv } from '../types/validation';
import { ChallengeController } from '../controllers/challenge';
import { GETAllChallenges, GETChallenge, POSTChallenge } from '../types/apitypes/challenge';

const router: Router = Router();
const challengeController: ChallengeController = new ChallengeController();

// Gets the challenge id
router.get('/', async (req: Request, res: Response) => {
    const name: string | undefined = req.query.name as string;
    try {
        const challenges: GETAllChallenges = await challengeController.get_all_challenges(name);
        res.status(200).json(challenges);
    } catch (err: any) {
      if (err instanceof HTTPError) res.status(err.code).send(err.msg);
      else res.sendStatus(500);
    }
});

// Gets a challenge from a challenge id
router.get('/:id', async (req: Request, res: Response) => {
    const id: string = req.params.id;
    try {
        const challenges: GETChallenge = await challengeController.get_challenge(id);
        res.status(200).json(challenges);
    } catch (err: any) {
      if (err instanceof HTTPError) res.status(err.code).send(err.msg);
      else res.sendStatus(500);
    }
});

// Gets the challenge id
router.post('/', async (req: Request, res: Response) => {
    const { name, start_date, duration, owner } = req.body;
    try {
        const challenges: POSTChallenge = await challengeController.post_challenge(
            name,
            start_date,
            duration,
            owner
        );
        res.status(200).json(challenges);
    } catch (err: any) {
      if (err instanceof HTTPError) res.status(err.code).send(err.msg);
      else res.sendStatus(500);
    }
});

export default router;