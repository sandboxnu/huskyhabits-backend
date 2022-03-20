import HTTPError from './HTTPError';
import { Response } from 'express';

// Responds to user with appropriate status code and message given an error from a controller
export const sendError = (err: any, res: Response) => {
  if (err instanceof HTTPError) {
    res.status(err.code).send(err.msg);
  } else {
    res.sendStatus(500);
  }
};
