import express from 'express';
import { getPublicGeneralSettings, getPublicContactSettings } from '../controllers/publicController';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Public routes - no authentication required
router.get('/general-settings', asyncHandler(getPublicGeneralSettings));
router.get('/contact-settings', asyncHandler(getPublicContactSettings));

export default router;
