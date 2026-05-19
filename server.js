import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config({ path: '.env' });
import app from './app.js';

const DB = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);

mongoose.connect(DB).then(() => console.log('DB connected successfully'));

const server = app.listen(process.env.PORT, () => {
  console.log('Server start on port', process.env.PORT);
});

process.on('unhandledRejection', (err) => {
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});
