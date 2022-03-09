import express from 'express';

import 'express-async-errors';
import { json } from 'body-parser';
import { signupRouter } from './routes';
import { errorHandler } from './middlewares';

const app = express();

app.use(json());

app.use(signupRouter);

app.get('/', (req, res) => {
  res.json({ message: 'hello' });
});

app.use(errorHandler);

export { app };
