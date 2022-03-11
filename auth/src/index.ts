import { app } from '@/app';
import dotenv from 'dotenv-safe';

dotenv.config();

const PORT = 3000;

app.listen(PORT, () => {
  console.info(`Server listening on ${PORT}`);
});
