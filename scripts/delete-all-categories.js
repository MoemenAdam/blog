import dotenv from 'dotenv';
import mongoose from 'mongoose';
import CategoriesModel from '../models/categoryModel.js';
dotenv.config({ path: '.env' });

const DB = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);
mongoose.connect(DB).then(async () => {
  await CategoriesModel.deleteMany();
  console.log('Categories cleared');
  process.exit();
});
