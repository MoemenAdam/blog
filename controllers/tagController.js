import TagModel from '../models/tagModel.js';
import AppError from '../utils/appError.js';
import generateMetaPagination from '../utils/metaPagination.js';

export const getAllTags = async (req, res) => {
  const queries = structuredClone(req.query);
  const filter = {};
  let sort = '';

  if (queries.search) {
    const value = queries.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.name = {
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

  const limit = Math.max(1, Number(queries.limit) || 15);
  const page = Math.max(1, Number(queries.page) || 1);

  const tags = await TagModel.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort);

  const totalDocs = await TagModel.countDocuments(filter);
  res.status(200).json({
    status: 'success',
    data: tags,
    meta: {
      ...generateMetaPagination({ totalDocs, page, limit, data: tags }),
    },
  });
};

export const getTag = async (req, res) => {
  const id = req.params.id;
  const tag = await TagModel.findById(id);

  if (!tag) {
    throw new AppError('Tag not found', 404);
  }
  res.status(200).json({
    status: 'success',
    data: tag,
  });
};

export const createTag = async (req, res, next) => {
  const body = {
    name: req.body?.name?.trim(),
  };
  const tag = await TagModel.create(body);
  res.status(200).json({
    status: 'success',
    data: tag,
  });
};

export const updateTag = async (req, res) => {
  const id = req.params.id;
  const body = {
    name: req.body?.name?.trim(),
  };
  const tag = await TagModel.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });
  if (!tag) {
    throw new AppError('Tag not found', 404);
  }
  res.status(200).json({
    status: 'success',
    data: tag,
  });
};

export const deleteTag = async (req, res) => {
  const id = req.params.id;
  const tag = await TagModel.findByIdAndDelete(id);
  if (!tag) {
    throw new AppError('Tag not found', 404);
  }
  res.status(204).json({
    status: 'success',
    data: req.body,
  });
};
