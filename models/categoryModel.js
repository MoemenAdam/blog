import mongoose from 'mongoose';
import slugify from 'slugify';

const schema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: [true, 'Category name is required'],
  },
  slug: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

schema.pre('save', function () {
  this.slug = slugify(this.name, { lower });
});

schema.pre('findOneAndUpdate', function () {
  const doc = this.getUpdate();
  if (doc.name) {
    doc.slug = slugify(doc.name, { lower });
  }
  doc.updatedAt = new Date();
});

const Model = mongoose.model('Category', schema);

export default Model;
