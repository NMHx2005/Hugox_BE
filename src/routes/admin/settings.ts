import express from 'express';
import {
    getSettings,
    updateSettings,
    getGeneralSettings,
    updateGeneralSettings,
    getContactSettings,
    updateContactSettings
} from '../../controllers/admin/settingsController';
import { authenticate, authorize } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Routes
router.get('/', asyncHandler(getSettings));
router.put('/', asyncHandler(updateSettings));

// General settings
router.get('/general', asyncHandler(getGeneralSettings));
router.put('/general', asyncHandler(updateGeneralSettings));

// Contact settings
router.get('/contact', asyncHandler(getContactSettings));
router.put('/contact', asyncHandler(updateContactSettings));

export default router;
