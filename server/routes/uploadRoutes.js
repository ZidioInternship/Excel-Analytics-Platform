// routes/uploadRoutes.js
import express from 'express';
import { uploadExcel } from '../controllers/uploadController.js';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadExcel);

export default router;

