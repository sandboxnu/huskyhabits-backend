import HTTPError from './HTTPError';
import { Response } from 'express';
import { AnyValidateFunction } from 'ajv/dist/types';

// Responds to user with appropriate status code and message given an error from a controller
export const sendError = (err: any, res: Response) => {
  if (err instanceof HTTPError) {
    res.status(err.code).send(err.msg);
  } else {
    res.sendStatus(500);
  }
};

// Sends an error to the user due to a failed data validation
export const sendValidationError = (
  validate: AnyValidateFunction,
  res: Response,
) => {
  if (!validate.errors) {
    res.sendStatus(400);
    return;
  }

  res
    .status(400)
    .send(
      `Input parsing error: ${validate.errors[0].instancePath} ${validate.errors[0].message}`,
    );
};
