import dotenv from 'dotenv';
import mongoose from 'mongoose';
import TagsModel from '../models/tagModel.js';
dotenv.config({ path: '.env' });

const DB = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);
mongoose.connect(DB).then(async () => {
  await TagsModel.deleteMany();
  console.log('Tags cleared');
  process.exit();
});
