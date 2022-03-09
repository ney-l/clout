import { BaseCustomError } from '@/errors/base-custom-error';
import { NextFunction, Request, Response } from 'express';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction // we need to pass this, else the errorHandler will not be called
) => {
  if (err instanceof BaseCustomError) {
    const statusCode = err.getStatusCode();
    const errors = err.serializeErrorOutput();
    return res.status(statusCode).send(errors);
  }

  res.sendStatus(500);
};
