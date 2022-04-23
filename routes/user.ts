import { Request, Response, Router } from 'express';
import { sendError } from '../exceptions/utils';
import { UserController } from '../controllers/user';
import { authenticated } from '../authentication';
import { GETUser } from '../types/apitypes/user';
import { Schema } from 'mongoose';

const mongoose = require('mongoose');

const router: Router = Router();
const userController: UserController = new UserController();

// Gets the user data of the current logged in user
router.get('/', async (req: Request, res: Response) => {
  try {
    const user: GETUser = await userController.user_get(req.user!._id);
    res.status(200).json(user);
  } catch (err: any) {
    sendError(err, res);
  }
});

// Gets the user with the given id
router.get('/:user_id', async (req: Request, res: Response) => {
  const user_id: Schema.Types.ObjectId = mongoose.Types.ObjectId(req.params.user_id); // passed as string, converted to Mongoose ObjectID
  try {
    const user: GETUser = await userController.user_get(user_id)
    res.status(200).json(user);
  } catch (err: any) {
    sendError(err, res);
  }
});

export default router;
