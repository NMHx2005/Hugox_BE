import express from 'express';
import { body, query } from 'express-validator';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  changeProductStatus
} from '../../controllers/admin/productController';
import { authenticate, authorize } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler';

const router = express.Router();

// All routes require admin authentication
router.use(authenticate);
router.use(authorize('admin'));

// Validation rules
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isMongoId().withMessage('Valid category ID is required'),
  body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer')
];

const statusValidation = [
  body('status').isIn(['active', 'inactive']).withMessage('Status must be either active or inactive')
];

const getProductsValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('search').optional().isLength({ min: 1, max: 100 }).withMessage('Search term must be between 1 and 100 characters')
];

// Routes
router.get('/', getProductsValidation, asyncHandler(getProducts));
router.get('/:id', asyncHandler(getProduct));
router.post('/', productValidation, asyncHandler(createProduct));
router.put('/:id', productValidation, asyncHandler(updateProduct));
router.put('/:id/status', statusValidation, asyncHandler(changeProductStatus));
router.delete('/:id', asyncHandler(deleteProduct));

export default router;
