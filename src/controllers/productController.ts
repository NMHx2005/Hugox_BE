import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { createError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

// Get all products with filtering and pagination
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  const {
    page = 1,
    limit = 12,
    category,
    minPrice,
    maxPrice,
    brand,
    status = 'active',
    featured,
    search,
    sort = '-createdAt'
  } = req.query;

  // Build filter object
  const filter: any = { status };

  if (category) {
    if (!mongoose.Types.ObjectId.isValid(category as string)) {
      throw createError('Invalid category ID', 400);
    }
    filter.category = category;
  }
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (brand) filter.brand = new RegExp(brand as string, 'i');
  if (featured !== undefined) filter.featured = featured === 'true';
  if (search) {
    filter.$or = [
      { name: new RegExp(search as string, 'i') },
      { description: new RegExp(search as string, 'i') },
      { tags: { $in: [new RegExp(search as string, 'i')] } }
    ];
  }

  // Calculate pagination
  const skip = (Number(page) - 1) * Number(limit);

  // Execute query
  const [products, total] = await Promise.all([
    Product.find(filter)
      .populate('category', 'name slug')
      .sort(sort as string)
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments(filter)
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

// Get single product by ID or slug
export const getProduct = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  // Check if id is a valid ObjectId (MongoDB ID format)
  const isObjectId = mongoose.Types.ObjectId.isValid(id) && id.length === 24;

  let product;
  if (isObjectId) {
    // Search by ID
    product = await Product.findById(id).populate('category', 'name slug');
  } else {
    // Search by slug
    product = await Product.findOne({ slug: id }).populate('category', 'name slug');
  }

  if (!product) {
    throw createError('Product not found', 404);
  }

  // Note: Rating and review count are now stored directly in the product document
  // No need to aggregate from Review collection anymore

  // Related products by same category
  const related = await Product.find({ _id: { $ne: product._id }, category: product.category, status: 'active' })
    .select('name price images category featured status')
    .limit(5)
    .populate('category', 'name slug');

  res.json({
    success: true,
    data: { product, related }
  });
};

// Get featured products
export const getFeaturedProducts = async (req: Request, res: Response): Promise<void> => {
  const { limit = 8 } = req.query;

  const products = await Product.find({
    featured: true,
    status: 'active'
  })
    .populate('category', 'name slug')
    .sort('-createdAt')
    .limit(Number(limit));

  res.json({
    success: true,
    data: { products }
  });
};

// Get related products
export const getRelatedProducts = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { limit = 5 } = req.query;

  const product = await Product.findById(id);
  if (!product) {
    throw createError('Product not found', 404);
  }

  const relatedProducts = await Product.find({
    _id: { $ne: id },
    category: product.category,
    status: 'active'
  })
    .populate('category', 'name slug')
    .limit(Number(limit));

  res.json({
    success: true,
    data: { products: relatedProducts }
  });
};

// Search products
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
  const { q, page = 1, limit = 12 } = req.query;

  if (!q) {
    throw createError('Search query is required', 400);
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [products, total] = await Promise.all([
    Product.find({
      $text: { $search: q as string },
      status: 'active'
    })
      .populate('category', 'name slug')
      .sort({ score: { $meta: 'textScore' } })
      .skip(skip)
      .limit(Number(limit)),
    Product.countDocuments({
      $text: { $search: q as string },
      status: 'active'
    })
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
