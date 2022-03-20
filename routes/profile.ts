import e, { Request, Response, Router } from 'express';
import { GETProfile } from '../apitypes/profile';
import ProfileModel from '../dbmodels/profile';
import HTTPError from '../exceptions/HTTPError';
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
      if (err instanceof HTTPError) res.status(err.code).send(err.msg);
      else res.sendStatus(500);
    });
});

// Creates a new profile with the given data
router.post('/', (req: Request, res: Response) => {
  const body = req.body;

  const p = new ProfileModel(body);

  p.save()
    .then((savedProfile) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

export default router;
