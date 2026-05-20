import express from 'express';
import PostsRoutes from './routes/postRoutes.js';
import CategoriesRoutes from './routes/categoryRoutes.js';
import TagsRoutes from './routes/tagRoutes.js';
import AnalyticsRoutes from './routes/analyticsRoutes.js';
import globalErrorHandler from './controllers/errorController.js';
import AppError from './utils/appError.js';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/v1/posts', PostsRoutes);
app.use('/api/v1/categories', CategoriesRoutes);
app.use('/api/v1/tags', TagsRoutes);
app.use('/api/v1/analytics', AnalyticsRoutes);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

export default app;
