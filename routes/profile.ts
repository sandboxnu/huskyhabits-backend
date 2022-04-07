import { Request, Response, Router } from 'express';
import { GETProfile, POSTCreateProfile } from '../types/apitypes/profile';
import { IProfile } from '../types/dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';
import { sendError, sendValidationError } from '../exceptions/utils';
import { ajv } from '../types/validation';
import {
  get_profile_photo,
  set_profile_photo,
  profile_get,
  profile_get_by_user_id,
  profile_post,
  user_owns_profile,
} from '../controllers/profile';
import { UploadedFile } from 'express-fileupload';
import { authenticated } from '../authentication';

const router: Router = Router();

// Gets the profile of the current logged in user
router.get('/', authenticated, (req: Request, res: Response) => {
  profile_get_by_user_id(req.user!._id)
    .then((profile: GETProfile) => {
      res.status(200).json(profile);
    })
    .catch((err: any) => {
      if (err instanceof HTTPError) res.status(err.code).send(err.msg);
      else res.sendStatus(500);
    });
});

// Gets the profile with the given id
router.get('/:profile_id', (req: Request, res: Response) => {
  const profile_id = req.params.profile_id;

  profile_get(profile_id)
    .then((profile: GETProfile) => {
      res.status(200).json(profile);
    })
    .catch((err: any) => {
      sendError(err, res);
    });
});

// Creates a new profile with the given data
router.post('/', authenticated, (req: Request, res: Response) => {
  const validate = ajv.getSchema<POSTCreateProfile>('POSTCreateProfile');
  if (!validate) {
    res.sendStatus(500);
    return;
  }

  if (validate(req.body)) {
    profile_post(req.body, req.user!)
      .then((profile: IProfile) => {
        res.status(200).send(profile);
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

// Gets the photo for a given profile
router.get('/:profile_id/photo', (req: Request, res: Response) => {
  const profile_id = req.params.profile_id;

  get_profile_photo(profile_id)
    .then((photo: any) => {
      res.status(200).send(photo);
    })
    .catch((err: any) => {
      sendError(err, res);
    });
});

// Sets the photo for a given profile
router.post(
  '/:profile_id/photo',
  authenticated,
  async (req: Request, res: Response) => {
    const profile_id = req.params.profile_id;

    if (!(await user_owns_profile(profile_id, req.user!))) {
      sendError(new HTTPError('Unauthorized', 401), res);
      return;
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      sendError(new HTTPError('Bad Request', 400), res);
      return;
    }

    const photoFile: UploadedFile | UploadedFile[] = req.files.photo;

    if (Array.isArray(photoFile)) {
      sendError(
        new HTTPError('Multiple images received, one expected', 400),
        res,
      );
      return;
    }

    const photo = {
      data: photoFile.data,
      contentType: photoFile.mimetype,
    };

    set_profile_photo(profile_id, photo)
      .then((profile: IProfile) => {
        res.status(200).send(profile);
      })
      .catch((err: any) => {
        sendError(err, res);
      });
  },
);

export default router;
