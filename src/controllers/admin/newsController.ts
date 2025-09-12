import { Request, Response } from 'express';
import News from '../../models/News';
import { createError } from '../../middleware/errorHandler';
import mongoose from 'mongoose';

// Get all news for admin
export const getNews = async (req: Request, res: Response): Promise<void> => {
    const {
        page = 1,
        limit = 12,
        search,
        category,
        status,
        sort = '-createdAt'
    } = req.query;

    const filter: any = {};

    if (search) {
        filter.$or = [
            { title: new RegExp(search as string, 'i') },
            { content: new RegExp(search as string, 'i') }
        ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

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

// Get single news for admin
export const getNewsArticle = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const article = await News.findById(id)
        .populate('author', 'name');

    if (!article) {
        throw createError('News article not found', 404);
    }

    res.json({
        success: true,
        data: { article }
    });
};

// Create news
export const createNews = async (req: Request, res: Response): Promise<void> => {
    const newsData = {
        ...req.body,
        author: req.body.author || 'admin' // Default author
    };

    const article = await News.create(newsData);

    await article.populate('author', 'name');

    res.status(201).json({
        success: true,
        message: 'News article created successfully',
        data: { article }
    });
};

// Update news
export const updateNews = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;

    const article = await News.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).populate('author', 'name');

    if (!article) {
        throw createError('News article not found', 404);
    }

    res.json({
        success: true,
        message: 'News article updated successfully',
        data: { article }
    });
};

// Delete news
export const deleteNews = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const article = await News.findByIdAndDelete(id);

    if (!article) {
        throw createError('News article not found', 404);
    }

    res.json({
        success: true,
        message: 'News article deleted successfully'
    });
};

// Change news status
export const changeNewsStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError('Invalid news ID', 400);
    }

    if (!['draft', 'published'].includes(status)) {
        throw createError('Status must be either draft or published', 400);
    }

    const article = await News.findByIdAndUpdate(
        id,
        {
            status,
            ...(status === 'published' && { publishedAt: new Date() }),
            updatedAt: new Date()
        },
        { new: true, runValidators: true }
    ).populate('author', 'name');

    if (!article) {
        throw createError('News article not found', 404);
    }

    res.json({
        success: true,
        message: `News article status changed to ${status}`,
        data: { article }
    });
};
