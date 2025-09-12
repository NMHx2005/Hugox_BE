import express from 'express';
import { body } from 'express-validator';
import { adminLogin, adminLogout, getAdminProfile } from '../../controllers/admin/authController';
import { authenticate, authorize } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Routes
router.post('/login', loginValidation, asyncHandler(adminLogin));
router.post('/logout', authenticate, authorize('admin'), asyncHandler(adminLogout));
router.get('/profile', authenticate, authorize('admin'), asyncHandler(getAdminProfile));

export default router;
