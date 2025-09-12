import { Request, Response } from 'express';
import Product from '../models/Product';
import News from '../models/News';
import { createError } from '../middleware/errorHandler';

// Global search across all content
export const globalSearch = async (req: Request, res: Response): Promise<void> => {
    const { q, type, page = 1, limit = 12 } = req.query;

    if (!q || (q as string).trim().length === 0) {
        throw createError('Search query is required', 400);
    }

    const searchQuery = (q as string).trim();
    const skip = (Number(page) - 1) * Number(limit);

    const searchResults: any = {
        products: [],
        news: [],
        total: 0
    };

    // Search products
    if (!type || type === 'products') {
        const [products, productCount] = await Promise.all([
            Product.find({
                $or: [
                    { name: new RegExp(searchQuery, 'i') },
                    { description: new RegExp(searchQuery, 'i') },
                    { tags: { $in: [new RegExp(searchQuery, 'i')] } }
                ],
                status: 'active'
            })
                .populate('category', 'name slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            Product.countDocuments({
                $or: [
                    { name: new RegExp(searchQuery, 'i') },
                    { description: new RegExp(searchQuery, 'i') },
                    { tags: { $in: [new RegExp(searchQuery, 'i')] } }
                ],
                status: 'active'
            })
        ]);

        searchResults.products = products;
        searchResults.total += productCount;
    }

    // Search news
    if (!type || type === 'news') {
        const [news, newsCount] = await Promise.all([
            News.find({
                $or: [
                    { title: new RegExp(searchQuery, 'i') },
                    { content: new RegExp(searchQuery, 'i') },
                    { tags: { $in: [new RegExp(searchQuery, 'i')] } }
                ],
                status: 'published'
            })
                .populate('author', 'name')
                .sort({ publishedAt: -1 })
                .skip(skip)
                .limit(Number(limit)),
            News.countDocuments({
                $or: [
                    { title: new RegExp(searchQuery, 'i') },
                    { content: new RegExp(searchQuery, 'i') },
                    { tags: { $in: [new RegExp(searchQuery, 'i')] } }
                ],
                status: 'published'
            })
        ]);

        searchResults.news = news;
        searchResults.total += newsCount;
    }

    res.json({
        success: true,
        data: {
            query: searchQuery,
            results: searchResults,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total: searchResults.total,
                pages: Math.ceil(searchResults.total / Number(limit))
            }
        }
    });
};

// Search products only
export const searchProducts = async (req: Request, res: Response): Promise<void> => {
    const { q, page = 1, limit = 12, category, minPrice, maxPrice, sort = '-createdAt' } = req.query;

    if (!q || (q as string).trim().length === 0) {
        throw createError('Search query is required', 400);
    }

    const searchQuery = (q as string).trim();
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {
        $or: [
            { name: new RegExp(searchQuery, 'i') },
            { description: new RegExp(searchQuery, 'i') },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
        ],
        status: 'active'
    };

    if (category) filter.category = category;
    if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };

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
            query: searchQuery,
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

// Search news only
export const searchNews = async (req: Request, res: Response): Promise<void> => {
    const { q, page = 1, limit = 12, category, sort = '-publishedAt' } = req.query;

    if (!q || (q as string).trim().length === 0) {
        throw createError('Search query is required', 400);
    }

    const searchQuery = (q as string).trim();
    const skip = (Number(page) - 1) * Number(limit);

    const filter: any = {
        $or: [
            { title: new RegExp(searchQuery, 'i') },
            { content: new RegExp(searchQuery, 'i') },
            { tags: { $in: [new RegExp(searchQuery, 'i')] } }
        ],
        status: 'published'
    };

    if (category) filter.category = category;

    const [news, total] = await Promise.all([
        News.find(filter)
            .populate('author', 'name')
            .sort(sort as string)
            .skip(skip)
            .limit(Number(limit)),
        News.countDocuments(filter)
    ]);

    res.json({
        success: true,
        data: {
            query: searchQuery,
            news,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        }
    });
};
