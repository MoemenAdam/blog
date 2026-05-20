import mongoose from 'mongoose';
import slugify from 'slugify';

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Post title is required'],
  },
  slug: {
    type: String,
  },
  content: {
    type: String,
  },
  categories: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
  },
  tags: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
      },
    ],
  },
  views: {
    type: Number,
    default: 0,
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
  this.slug = slugify(this.title, { lower });
});

schema.pre('findOneAndUpdate', function () {
  const doc = this.getUpdate();
  if (doc.title) {
    doc.slug = slugify(doc.title, { lower });
  }
  doc.updatedAt = new Date();
});

const Model = mongoose.model('Post', schema);

export default Model;
