import CategoryModel from '../models/categoryModel.js';
import AppError from '../utils/appError.js';
import generateMetaPagination from '../utils/metaPagination.js';

export const getAllCategories = async (req, res) => {
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

  const limit = Math.max(1, Number(queries.limit) || 15);
  const page = Math.max(1, Number(queries.page) || 1);

  const categories = await CategoryModel.find(filter)
    .skip((page - 1) * limit)
    .limit(limit)
    .sort(sort);

  const totalDocs = await CategoryModel.countDocuments(filter);
  res.status(200).json({
    status: 'success',
    data: categories,
    meta: {
      ...generateMetaPagination({ totalDocs, page, limit, data: categories }),
    },
  });
};

export const getCategory = async (req, res) => {
  const id = req.params.id;

  const category = await CategoryModel.findById(id);

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: category,
  });
};

export const createCategory = async (req, res) => {
  const body = {
    name: req.body?.name?.trim(),
  };

  const category = await CategoryModel.create(body);

  res.status(200).json({
    status: 'success',
    data: category,
  });
};

export const updateCategory = async (req, res) => {
  const id = req.params.id;

  const body = {
    name: req.body?.name?.trim(),
  };

  const category = await CategoryModel.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.status(200).json({
    status: 'success',
    data: category,
  });
};

export const deleteCategory = async (req, res) => {
  const id = req.params.id;

  const category = await CategoryModel.findByIdAndDelete(id);

  if (!category) {
    throw new AppError('Category not found', 404);
  }

  res.status(204).json({
    status: 'success',
    data: req.body,
  });
};
