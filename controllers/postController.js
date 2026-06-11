import PostModel from '../models/postModel.js';
import AppError from '../utils/appError.js';
import generateMetaPagination from '../utils/metaPagination.js';
import imagekit from '../imagekit.js';

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
    .populate(['tags', 'categories'])
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
  const post = await PostModel.findById(id).populate(['tags', 'categories']);

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
  ).populate(['tags', 'categories']);
  if (!post) {
    throw new AppError('Post not found', 404);
  }
  res.status(200).json({
    status: 'success',
    data: post,
  });
};

export const createPost = async (req, res, next) => {
  let image = {};
  if (req.file) {
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: '/posts',
    });

    image = uploadedImage;
  }
  const tags = [];
  const categories = [];
  new Set(
    Array.isArray(req.body?.tags) ? req.body?.tags : [req.body?.tags]
  ).forEach((el) => tags.push(el));
  new Set(
    Array.isArray(req.body?.categories)
      ? req.body?.categories
      : [req.body?.categories]
  ).forEach((el) => categories.push(el));
  const body = {
    title: req.body?.title?.trim(),
    content: req.body?.content?.trim(),
    categories: categories ?? [],
    tags: tags ?? [],
    image: image.url,
    imageId: image.fileId,
  };
  try {
    const post = await PostModel.create(body);
    await post.populate(['tags', 'categories']);
    res.status(200).json({
      status: 'success',
      data: post,
    });
  } catch (err) {
    await imagekit.deleteFile(image.fileId);
    next(err);
  }
};

export const updatePost = async (req, res) => {
  const id = req.params.id;
  const oldPost = await PostModel.findById(id);
  if (!oldPost) {
    throw new AppError('Post not found', 404);
  }

  let image = {};
  if (req.file) {
    const uploadedImage = await imagekit.upload({
      file: req.file.buffer,
      fileName: `${Date.now()}-${req.file.originalname}`,
      folder: '/posts',
    });

    image = uploadedImage;
  }
  const tags = [
    ...new Set(
      Array.isArray(req.body.tags)
        ? req.body.tags
        : req.body.tags
        ? [req.body.tags]
        : []
    ),
  ];
  const categories = [
    ...new Set(
      Array.isArray(req.body.categories)
        ? req.body.categories
        : req.body.categories
        ? [req.body.categories]
        : []
    ),
  ];
  const body = {};

  if (req.body?.title?.trim()) {
    body.title = req.body.title.trim();
  }

  if (req.body?.content?.trim()) {
    body.content = req.body.content.trim();
  }

  if (categories.length) {
    body.categories = categories;
  }

  if (tags.length) {
    body.tags = tags;
  }

  if (image.url) {
    body.image = image.url;
    body.imageId = image.fileId;
  }
  const post = await PostModel.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).populate(['tags', 'categories']);

  if (image.fileId && oldPost.imageId)
    await imagekit.deleteFile(oldPost.imageId);
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
  if (post.imageId) await imagekit.deleteFile(post.imageId);
  res.status(204).json({
    status: 'success',
    data: req.body,
  });
};
