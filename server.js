import dotenv from 'dotenv';
import mongoose from 'mongoose';

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1);
});
dotenv.config({ path: '.env' });
console.log(process.env.DATABASE, process.env.PASSWORD);
import app from './app.js';

const DB = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);

let server;

const start = async () => {
  try {
    await mongoose.connect(DB);
    console.log('DB connected successfully');

    server = app.listen(process.env.PORT, () => {
      console.log(`Server started on port ${process.env.PORT}`);
    });
  } catch (err) {
    console.error('Startup error:', err);

    process.exit(1);
  }
};

start();

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
