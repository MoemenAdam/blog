import PostModel from '../models/postModel.js';
import AppError from '../utils/appError.js';
import generateMetaPagination from '../utils/metaPagination.js';

export const getAllPosts = async (req, res) => {
  const queries = structuredClone(req.query);
  const filter = {};
  let sort = '';

  if (queries.search) {
    const value = queries.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.title = {
      $regex: value,
      $options: 'i',
    };
  }

  if (queries.sort) {
    if (Array.isArray(queries.sort)) {
      sort = queries.sort.join(' ');
    } else {
      sort = queries.sort;
    }
  } else sort = '-createdAt';

  if (queries.tags) {
    if (Array.isArray(queries.tags)) {
      filter.tags = { $in: queries.tags };
    } else {
      filter.tags = queries.tags;
    }
  }

  if (queries.categories) {
    if (Array.isArray(queries.categories)) {
      filter.categories = { $in: queries.categories };
    } else {
      filter.categories = queries.categories;
    }
  }

  const limit = Math.max(1, Number(queries.limit) || 15);
  const page = Math.max(1, Number(queries.page) || 1);

  const posts = await PostModel.find(filter)
    .populate('tags')
    .populate('categories')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort);

  const totalDocs = await PostModel.countDocuments(filter);
  res.status(200).json({
    status: 'success',
    data: posts,
    meta: {
      ...generateMetaPagination({ totalDocs, page, limit, data: posts }),
    },
  });
};

export const getPost = async (req, res) => {
  const id = req.params.id;
  const post = await PostModel.findById(id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }
  res.status(200).json({
    status: 'success',
    data: post,
  });
};

export const viewPost = async (req, res) => {
  const id = req.params.id;
  const post = await PostModel.findByIdAndUpdate(
    id,
    {
      $inc: { views: 1 },
    },
    { new: 1 }
  );
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  res.status(200).json({
    status: 'success',
    data: post,
  });
};

export const createPost = async (req, res, next) => {
  const body = {
    title: req.body?.title?.trim(),
    content: req.body?.content?.trim(),
    categories: req.body?.categories ?? [],
    tags: req.body?.tags?.trim() ?? [],
  };
  const post = await PostModel.create(body);
  res.status(200).json({
    status: 'success',
    data: post,
  });
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const body = {
    title: req.body?.title?.trim(),
    content: req.body?.content?.trim(),
    categories: req.body?.categories ?? [],
    tags: req.body?.tags?.trim() ?? [],
  };
  const post = await PostModel.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  res.status(200).json({
    status: 'success',
    data: post,
  });
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const post = await PostModel.findByIdAndDelete(id);
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  res.status(204).json({
    status: 'success',
    data: req.body,
  });
};
