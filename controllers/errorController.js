import AppError from '../utils/appError.js';

const handleCastError = (err) => {
  return new AppError(
    `Can't find any element with this ${err.path} = ${err.value}`,
    404
  );
};

const handleValidationError = (err) => {
  const errors = {};
  let errMessage = 'Validation error';
  Object.entries(err.errors).forEach(([key, value]) => {
    const message = (errors[key] =
      value.name === 'CastError'
        ? `${value.reason.value} is not valid`
        : value.message);
    errMessage = message;
    return message;
  });
  return new AppError(errMessage, 400, errors);
};

const handleDuplicateError = (err) => {
  const errors = {};
  Object.keys(err.keyPattern).forEach(
    (key) => (errors[key] = `This ${key} is used before`)
  );
  return new AppError(`Duplicate error`, 400, errors);
};

const DevErrors = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

const ProdErrors = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      errors: err.errors,
      message: err.message,
    });
  } else {
    console.error(err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  err.message = err.message || 'Something went wrong';

  if (process.env.NODE_ENV === 'development') {
    DevErrors(err, res);
  } else {
    let error = err;
    if (error.name === 'CastError') error = handleCastError(error);
    else if (error.name === 'ValidationError')
      error = handleValidationError(error);
    else if (error.code === 11000) error = handleDuplicateError(error);

    ProdErrors(error, res);
  }
};

export default globalErrorHandler;
