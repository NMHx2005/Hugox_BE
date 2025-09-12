import { Request, Response } from 'express';
import Product from '../models/Product';
import News from '../models/News';
import Category from '../models/Category';

// Get mobile bottom bar configuration
export const getBottomBarConfig = async (req: Request, res: Response): Promise<void> => {
    const config = {
        items: [
            {
                id: 'home',
                label: 'Trang chủ',
                icon: 'home',
                route: '/',
                active: true
            },
            {
                id: 'products',
                label: 'Sản phẩm',
                icon: 'shopping-bag',
                route: '/products',
                active: false
            },
            {
                id: 'news',
                label: 'Tin tức',
                icon: 'newspaper',
                route: '/news',
                active: false
            },
            {
                id: 'contact',
                label: 'Liên hệ',
                icon: 'phone',
                route: '/contact',
                active: false
            }
        ],
        contact: {
            zalo: 'https://zalo.me/0878784842',
            hotline: '08.7878.4842'
        }
    };

    res.json({
        success: true,
        data: { config }
    });
};

// Get hero banner configuration
export const getHeroBannerConfig = async (req: Request, res: Response): Promise<void> => {
    const banners = [
        {
            id: 1,
            title: 'HugoX E-commerce',
            subtitle: 'Hệ thống thương mại điện tử chuyên nghiệp',
            image: '/images/hero-banner-1.jpg',
            link: '/products',
            buttonText: 'Khám phá ngay',
            active: true
        },
        {
            id: 2,
            title: 'Sản phẩm chất lượng cao',
            subtitle: 'Cam kết chất lượng và giá cả hợp lý',
            image: '/images/hero-banner-2.jpg',
            link: '/products',
            buttonText: 'Mua ngay',
            active: false
        },
        {
            id: 3,
            title: 'Tin tức mới nhất',
            subtitle: 'Cập nhật những thông tin mới nhất về sản phẩm',
            image: '/images/hero-banner-3.jpg',
            link: '/news',
            buttonText: 'Đọc thêm',
            active: false
        }
    ];

    res.json({
        success: true,
        data: { banners }
    });
};

// Get featured sections for mobile
export const getFeaturedSections = async (req: Request, res: Response): Promise<void> => {
    const { limit = 6 } = req.query;

    // Get featured products
    const featuredProducts = await Product.find({
        featured: true,
        status: 'active'
    })
        .populate('category', 'name slug')
        .sort({ createdAt: -1 })
        .limit(Number(limit));

    // Get featured news
    const featuredNews = await News.find({
        featured: true,
        status: 'published'
    })
        .populate('author', 'name')
        .sort({ publishedAt: -1 })
        .limit(Number(limit));

    // Get categories with product counts
    const categories = await Category.aggregate([
        { $match: { status: 'active' } },
        {
            $lookup: {
                from: 'products',
                localField: '_id',
                foreignField: 'category',
                as: 'products'
            }
        },
        {
            $addFields: {
                productCount: { $size: '$products' }
            }
        },
        {
            $match: { productCount: { $gt: 0 } }
        },
        {
            $project: {
                name: 1,
                slug: 1,
                image: 1,
                productCount: 1
            }
        },
        { $sort: { productCount: -1 } },
        { $limit: 6 }
    ]);

    const sections = {
        featuredProducts,
        featuredNews,
        categories
    };

    res.json({
        success: true,
        data: { sections }
    });
};
