import express from 'express';
import {
    getDashboardStats,
    getRevenueData,
    getOrdersData,
    getCategoryData,
    getTrendsData
} from '../../controllers/admin/dashboardController';
import { authenticate, authorize } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Routes
router.get('/stats', asyncHandler(getDashboardStats));
router.get('/revenue', asyncHandler(getRevenueData));
router.get('/orders', asyncHandler(getOrdersData));
router.get('/categories', asyncHandler(getCategoryData));
router.get('/trends', asyncHandler(getTrendsData));

export default router;
