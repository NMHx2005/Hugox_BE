import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import { createError } from '../middleware/errorHandler';

// Get products by category slug
export const getProductsByCategorySlug = async (req: Request, res: Response): Promise<void> => {
    const { slug } = req.params;
    const {
        page = 1,
        limit = 12,
        minPrice,
        maxPrice,
        sort = '-createdAt'
    } = req.query;

    // Find category by slug
    const category = await Category.findOne({ slug });
    if (!category) {
        throw createError('Category not found', 404);
    }

    // Build filter object
    const filter: any = {
        category: category._id,
        status: 'active'
    };

    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
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
            category: {
                _id: category._id,
                name: category.name,
                slug: category.slug,
                image: category.image
            },
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        }
    });
};
