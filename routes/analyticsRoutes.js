import express from 'express';
import { getAllDocs } from '../controllers/analyticsController.js';

const router = express.Router();

router.route('/').get(getAllDocs);

export default router;
