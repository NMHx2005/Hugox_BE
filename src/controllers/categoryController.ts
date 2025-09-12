import { Request, Response } from 'express';
import Category from '../models/Category';
import Product from '../models/Product';
import { createError } from '../middleware/errorHandler';

// Get all categories
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  const categories = await Category.find({ status: 'active' })
    .populate('subcategories')
    .sort({ sortOrder: 1, name: 1 });

  res.json({
    success: true,
    data: { categories }
  });
};

// Get single category
export const getCategory = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const category = await Category.findById(id)
    .populate('subcategories');

  if (!category) {
    throw createError('Category not found', 404);
  }

  res.json({
    success: true,
    data: { category }
  });
};

// Get products by category
export const getCategoryProducts = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { page = 1, limit = 12, sort = '-createdAt' } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find({ category: id, status: 'active' })
      .populate('category', 'name slug')
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments({ category: id, status: 'active' })
  ]);

  res.json({
    success: true,
    data: {
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    }
  });
};
