import { STATUS_CODES } from '@/constants/statusCodes';
import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { handleMethodNotAllowed } from './utils';

const signupRouter = express.Router();

const lowerCaseRegex = /(.*[a-z].*)/;
const uppercaseRegex = /(.*[A-Z].*)/;
const digitRegex = /(.*\d.*)/;

const SIGNUP_ENDPOINT = '/api/auth/signup';

signupRouter.post(
  SIGNUP_ENDPOINT,
  body('email')
    .isEmail()
    .withMessage('Email must be a valid email address.')
    .normalizeEmail(),
  body('password')
    .trim()
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
  body('password').escape(),
  (req: Request, res: Response) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(STATUS_CODES.UNPROCESSABLE_ENTITY).send({});
    }

    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    if (/.+@[A-Z]/g.test(email)) {
      res.sendStatus(422);
    }

    if (/[><'"/]/g.test(password)) {
      res.sendStatus(422);
    }

    return res.send({ email });
  }
);

signupRouter.options(SIGNUP_ENDPOINT, (req, res) => {
  res.header('access-control-allow-origin', '*');
  res.header('access-control-allow-methods', 'POST,OPTIONS');
  res.header(
    'access-control-allow-headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With'
  );
  return res.sendStatus(200);
});

signupRouter.get(SIGNUP_ENDPOINT, handleMethodNotAllowed);
signupRouter.put(SIGNUP_ENDPOINT, handleMethodNotAllowed);
signupRouter.patch(SIGNUP_ENDPOINT, handleMethodNotAllowed);
signupRouter.delete(SIGNUP_ENDPOINT, handleMethodNotAllowed);

export { signupRouter, SIGNUP_ENDPOINT };
