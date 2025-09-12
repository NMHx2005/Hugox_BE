import express from 'express';
import { body } from 'express-validator';
import { submitContact, submitAgentContact } from '../controllers/contactController';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// Validation rules
const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').isMobilePhone('vi-VN').withMessage('Valid phone number is required'),
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('content').trim().notEmpty().withMessage('Content is required')
];

// Routes
router.post('/', contactValidation, asyncHandler(submitContact));
router.post('/agent', contactValidation, asyncHandler(submitAgentContact));

export default router;
