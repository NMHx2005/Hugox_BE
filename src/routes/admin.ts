import express from 'express';
import adminAuthRoutes from './admin/auth';
import adminProductRoutes from './admin/products';
import adminCategoryRoutes from './admin/categories';
import adminNewsRoutes from './admin/news';
import adminReviewRoutes from './admin/reviews';
import adminContactRoutes from './admin/contacts';
import adminUserRoutes from './admin/users';
import adminDashboardRoutes from './admin/dashboard';
import adminSettingsRoutes from './admin/settings';

const router = express.Router();

// Admin routes
router.use('/auth', adminAuthRoutes);
router.use('/products', adminProductRoutes);
router.use('/categories', adminCategoryRoutes);
router.use('/news', adminNewsRoutes);
router.use('/reviews', adminReviewRoutes);
router.use('/contacts', adminContactRoutes);
router.use('/users', adminUserRoutes);
router.use('/dashboard', adminDashboardRoutes);
router.use('/settings', adminSettingsRoutes);

export default router;
