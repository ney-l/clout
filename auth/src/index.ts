import express from 'express';

const app = express();

app.get('*', (req, res) => {
  res.json({ message: 'hello' });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.info(`Server listening on ${PORT}`);
});
