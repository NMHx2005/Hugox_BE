import { Request, Response } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';

// Get filter categories
export const getFilterCategories = async (req: Request, res: Response): Promise<void> => {
    const categories = await Category.find({ status: 'active' })
        .select('name slug')
        .sort({ name: 1 });

    res.json({
        success: true,
        data: { categories }
    });
};

// Get price ranges for filtering
export const getPriceRanges = async (req: Request, res: Response): Promise<void> => {
    const priceStats = await Product.aggregate([
        { $match: { status: 'active' } },
        {
            $group: {
                _id: null,
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                avgPrice: { $avg: '$price' }
            }
        }
    ]);

    const stats = priceStats[0] || { minPrice: 0, maxPrice: 1000000, avgPrice: 500000 };

    // Generate price ranges
    const ranges = [
        { label: 'Dưới 100.000đ', min: 0, max: 100000 },
        { label: '100.000đ - 500.000đ', min: 100000, max: 500000 },
        { label: '500.000đ - 1.000.000đ', min: 500000, max: 1000000 },
        { label: '1.000.000đ - 2.000.000đ', min: 1000000, max: 2000000 },
        { label: 'Trên 2.000.000đ', min: 2000000, max: null }
    ];

    res.json({
        success: true,
        data: {
            ranges,
            stats: {
                minPrice: stats.minPrice,
                maxPrice: stats.maxPrice,
                avgPrice: Math.round(stats.avgPrice)
            }
        }
    });
};

// Get brands for filtering
export const getBrands = async (req: Request, res: Response): Promise<void> => {
    const brands = await Product.aggregate([
        { $match: { status: 'active', brand: { $exists: true, $ne: '' } } },
        {
            $group: {
                _id: '$brand',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $project: {
                name: '$_id',
                count: 1,
                _id: 0
            }
        }
    ]);

    res.json({
        success: true,
        data: { brands }
    });
};

// Get product tags for filtering
export const getProductTags = async (req: Request, res: Response): Promise<void> => {
    const tags = await Product.aggregate([
        { $match: { status: 'active', tags: { $exists: true, $ne: [] } } },
        { $unwind: '$tags' },
        {
            $group: {
                _id: '$tags',
                count: { $sum: 1 }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $project: {
                name: '$_id',
                count: 1,
                _id: 0
            }
        }
    ]);

    res.json({
        success: true,
        data: { tags }
    });
};
