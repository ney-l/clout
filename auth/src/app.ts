import express from 'express';
import { json } from 'body-parser';
import { signupRouter } from './routes';

const app = express();

app.use(json());

app.use(signupRouter);

app.get('*', (req, res) => {
  res.json({ message: 'hello' });
});

export { app };
