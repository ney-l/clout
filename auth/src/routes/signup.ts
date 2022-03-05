import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const signupRouter = express.Router();

signupRouter.post(
  '/api/auth/signup',
  body('email').isEmail().withMessage('Email must be a valid email address.'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).send();
    }
    const { email } = req.body as { email?: string };

    if (!email) {
      return res.status(422).send({});
    }

    return res.send({});
  }
);

export { signupRouter };
