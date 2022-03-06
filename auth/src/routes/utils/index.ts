import { Request, Response } from 'express';
import { STATUS_CODES } from '@/constants/statusCodes';

export const handleMethodNotAllowed = (req: Request, res: Response) => {
  res.sendStatus(STATUS_CODES.METHOD_NOT_ALLOWED);
};
