import { Request, Response, Router } from 'express';
import ProfileModel from '../models/profile';

const router: Router = Router();

// Gets the profile of the current logged in user
router.get('/', (req: Request, res: Response) => {
  const id = '621592eb5d1d819799a2598d'; // TODO: change this to current user

  ProfileModel.findOne({ _id: id })
    .then((profile) => {
      res.status(200).json(profile);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

// Gets the profile with the given id
router.get('/:id', (req: Request, res: Response) => {
  const id = req.params.id;

  ProfileModel.findById(id, (err: any, profile: any) => {
    if (err) {
      res.status(400).json(err);
    }
    if (!profile) {
      res.status(404).json('Profile does not exist');
    } else {
      res.status(200).json(profile);
    }
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
