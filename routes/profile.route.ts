import { Request, Response, Router } from 'express';
import { GETProfile, POSTCreateProfile } from '../types/apitypes/profile';
import IProfile, { ProfilePhoto } from '../types/dbtypes/profile';
import HTTPError from '../exceptions/HTTPError';
import { sendError, sendValidationError } from '../exceptions/utils';
import { ajv } from '../types/validation';
import { ProfileController, } from '../controllers/profile';
import { UploadedFile } from 'express-fileupload';
import { authenticated } from '../authentication';

const router: Router = Router();
const profileController: ProfileController = new ProfileController();

// Gets the profile of the current logged in user
router.get('/', authenticated, async (req: Request, res: Response) => {
  try {
    const profile: GETProfile = await profileController.profile_get_by_user_id(req.user!._id)
    res.status(200).json(profile);
  } catch (err: any) {
    sendError(err, res);
  }
});

// Gets the profile with the given id
router.get('/:profile_id', async (req: Request, res: Response) => {
  const profile_id = req.params.profile_id;
  try {
    const profile: GETProfile = await profileController.profile_get(profile_id);
    res.status(200).json(profile);
  } catch (err: any) {
    sendError(err, res);
  }
});

// Creates a new profile with the given data
router.post('/', authenticated, async (req: Request, res: Response) => {
  const validate = ajv.getSchema<POSTCreateProfile>('POSTCreateProfile');
  if (!validate) {
    res.sendStatus(500);
    return;
  }

  if (validate(req.body)) {
    try {
      const profile: IProfile = await profileController.profile_post(req.body, req.user!);
      res.status(200).send(profile);
    } catch (err: any) {
      if (err.name == 'MongoServerError' && err.code == 11000) {
        err = new HTTPError('Profile already exists', 400);
      }
      sendError(err, res);
    }
  } else {
    sendValidationError(validate, res);
  }
});

// Gets the photo for a given profile
router.get('/:profile_id/photo', async (req: Request, res: Response) => {
  const profile_id = req.params.profile_id;

  try {
    const photo = await profileController.get_profile_photo(profile_id);
    res.status(200).send(photo);
  } catch (err: any) {
    sendError(err, res); 
  }
});

// Sets the photo for a given profile
router.post(
  '/:profile_id/photo',
  authenticated,
  async (req: Request, res: Response) => {
    const profile_id = req.params.profile_id;
    const ownsProfile = await profileController.user_owns_profile(profile_id, req.user!);
    if (!ownsProfile) {
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

    const photo: ProfilePhoto = {
      data: photoFile.data,
      contentType: photoFile.mimetype,
    };

    try {
      const profile = await profileController.set_profile_photo(profile_id, photo);
      res.status(200).send(profile);
    } catch (err: any) {
      sendError(err, res);
    }
  },
);

export default router;
