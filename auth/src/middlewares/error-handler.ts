import { BaseCustomError } from '@/errors/base-custom-error';
import { Request, Response } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response) => {
  if (err instanceof BaseCustomError) {
    return res.sendStatus(err.getStatusCode());
  }

  res.sendStatus(500);
};
