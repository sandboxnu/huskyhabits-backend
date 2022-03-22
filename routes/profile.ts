import { Request, Response, Router } from 'express';
import { GETProfile, POSTCreateProfile } from '../apitypes/profile';
import { IProfile } from '../dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';
import { sendError } from '../exceptions/utils';
const profile_controller = require('../controllers/profile');

const router: Router = Router();

// Gets the profile of the current logged in user
router.get('/', (req: Request, res: Response) => {
  const user_id = '621592eb5d1d819799a2598d'; // TODO: change this to current user

  profile_controller
    .get_profile(user_id)
    .then((profile: GETProfile) => {
      res.status(200).json(profile);
    })
    .catch((err: any) => {
      if (err instanceof HTTPError) res.status(err.code).send(err.msg);
      else res.sendStatus(500);
    });
});

// Gets the profile with the given id
router.get('/:user_id', (req: Request, res: Response) => {
  const user_id = req.params.user_id;

  profile_controller
    .get_profile(user_id)
    .then((profile: GETProfile) => {
      res.status(200).json(profile);
    })
    .catch((err: any) => {
      sendError(err, res);
    });
});

// Creates a new profile with the given data
router.post('/', (req: Request, res: Response) => {
  // TODO - validate type of body
  const profile: POSTCreateProfile = {
    user_id: req.body.user_id,
    username: req.body.username,
    bio: req.body.bio || '',
    photo: req.body.photo || '',
  };

  profile_controller
    .create_profile(profile)
    .then((_: IProfile) => {
      res.sendStatus(200);
    })
    .catch((err: any) => {
      sendError(err, res);
    });
});

export default router;
