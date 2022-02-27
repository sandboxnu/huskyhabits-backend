import { Request, Response, Router } from 'express';
import ProfileModel from '../models/profile';

const router: Router = Router();

// Gets the profile of the current logged in user
router.get('/', (req: Request, res: Response) => {
  let id = '621592eb5d1d819799a2598d'; // TODO: change this to current user

  ProfileModel.findOne({ _id: id })
    .then((profile) => {
      res.status(200).json(profile);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

// Gets the profile with the given id
router.get('/:id', async (req: Request, res: Response) => {
  let id = req.params.id;

  ProfileModel.findOne({ _id: id })
    .then((profile) => {
      res.status(200).json(profile);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

// Creates a new profile with the given data
router.post('/', (req: Request, res: Response) => {
  let body = req.body;

  let p = new ProfileModel(body);

  p.save()
    .then((savedProfile) => {
      res.sendStatus(200);
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

export default router;
