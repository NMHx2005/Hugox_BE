import { Request, Response } from 'express';
import News from '../models/News';
import { createError } from '../middleware/errorHandler';

// Get all news
export const getNews = async (req: Request, res: Response): Promise<void> => {
  const {
    page = 1,
    limit = 12,
    category,
    search,
    sort = '-publishedAt'
  } = req.query;

  const filter: any = { status: 'published' };

  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: new RegExp(search as string, 'i') },
      { content: new RegExp(search as string, 'i') },
      { tags: { $in: [new RegExp(search as string, 'i')] } }
    ];
  }

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

// Get single news article
export const getNewsArticle = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  const article = await News.findById(id)
    .populate('author', 'name');

  if (!article || article.status !== 'published') {
    throw createError('News article not found', 404);
  }

  // Increment views
  article.views += 1;
  await article.save();

  res.json({
    success: true,
    data: { article }
  });
};

// Get featured news
export const getFeaturedNews = async (req: Request, res: Response): Promise<void> => {
  const { limit = 6 } = req.query;

  const news = await News.find({
    featured: true,
    status: 'published'
  })
    .populate('author', 'name')
    .sort({ publishedAt: -1 })
    .limit(Number(limit));

  res.json({
    success: true,
    data: { news }
  });
};

// Get news by category
export const getNewsByCategory = async (req: Request, res: Response): Promise<void> => {
  const { category } = req.params;
  const { page = 1, limit = 12 } = req.query;

  const skip = (Number(page) - 1) * Number(limit);

  const [news, total] = await Promise.all([
    News.find({ category, status: 'published' })
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    News.countDocuments({ category, status: 'published' })
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

// Get news categories
export const getNewsCategories = async (req: Request, res: Response): Promise<void> => {
  const categories = await News.distinct('category', { status: 'published' });

  res.json({
    success: true,
    data: { categories }
  });
};
