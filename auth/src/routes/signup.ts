import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';

const signupRouter = express.Router();

const lowerCaseRegex = /(.*[a-z].*)/;
const uppercaseRegex = /(.*[A-Z].*)/;
const digitRegex = /(.*\d.*)/;

signupRouter.post(
  '/api/auth/signup',
  body('email').isEmail().withMessage('Email must be a valid email address.'),
  body('password').trim(),
  body('password')
    .isLength({ min: 8, max: 32 })
    .withMessage('Password must be between 8 and 32 characters'),
  body('password')
    .matches(lowerCaseRegex)
    .withMessage('Password must contain at least one lowercase character'),
  body('password')
    .matches(uppercaseRegex)
    .withMessage('Password must contain at least one uppercase character'),
  body('password')
    .matches(digitRegex)
    .withMessage('Password must contain at least one number'),
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).send({ errors: errors.array() });
    }
    // const { email } = req.body as { email?: string };

    return res.send({});
  }
);

export { signupRouter };
