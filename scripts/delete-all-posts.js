import dotenv from 'dotenv';
import mongoose from 'mongoose';
import PostModel from '../models/postModel.js';
dotenv.config({ path: '.env' });

const DB = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);
mongoose.connect(DB).then(async () => {
  await PostModel.deleteMany();
  console.log('Posts cleared');
  process.exit();
});
