import dotenv from 'dotenv';
import mongoose from 'mongoose';
import PostModel from '../models/postModel.js';
import TagsModel from '../models/tagModel.js';
import CategoriesModel from '../models/categoryModel.js';
dotenv.config({ path: '.env' });

const DB = process.env.DATABASE.replace('<db_password>', process.env.PASSWORD);
mongoose.connect(DB).then(async () => {
  await PostModel.deleteMany();
  await CategoriesModel.deleteMany();
  await TagsModel.deleteMany();
  console.log('DB cleared');
  process.exit();
});
