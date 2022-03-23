import { Request, Response, Router } from 'express';
import { GETProfile, POSTCreateProfile } from '../types/apitypes/profile';
import { IProfile } from '../types/dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';
import { sendError, sendValidationError } from '../exceptions/utils';
import { ajv } from '../types/validation';
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
  const validate = ajv.getSchema<POSTCreateProfile>('POSTCreateProfile');
  if (!validate) {
    res.sendStatus(500);
    return;
  }

  if (validate(req.body)) {
    profile_controller
      .create_profile(req.body)
      .then((_: IProfile) => {
        res.sendStatus(200);
      })
      .catch((err: any) => {
        if (err.name == 'MongoServerError' && err.code == 11000) {
          err = new HTTPError('Profile already exists', 400);
        }
        sendError(err, res);
      });
  } else {
    sendValidationError(validate, res);
  }
});

export default router;
