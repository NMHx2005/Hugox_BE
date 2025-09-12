import { Request, Response } from 'express';
import Product from '../../models/Product';
import User from '../../models/User';
import Contact from '../../models/Contact';
import News from '../../models/News';
import Review from '../../models/Review';
import { DashboardStats } from '../../types';
import { createError } from '../../middleware/errorHandler';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));

    // Get basic counts
    const [
        totalProducts,
        totalUsers,
        totalContacts,
        totalNews,
        totalReviews
    ] = await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Contact.countDocuments(),
        News.countDocuments(),
        Review.countDocuments()
    ]);

    // Get recent contacts (last 7 days)
    const recentContacts = await Contact.find({
        createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
        .sort('-createdAt')
        .limit(5)
        .select('name email subject status createdAt');

    // Get top products by reviews
    const topProducts = await Product.aggregate([
        {
            $lookup: {
                from: 'reviews',
                localField: '_id',
                foreignField: 'product',
                as: 'reviews'
            }
        },
        {
            $addFields: {
                reviewCount: { $size: '$reviews' },
                averageRating: { $avg: '$reviews.rating' }
            }
        },
        {
            $match: {
                reviewCount: { $gt: 0 }
            }
        },
        {
            $sort: { reviewCount: -1 }
        },
        {
            $limit: 5
        },
        {
            $project: {
                name: 1,
                images: 1,
                price: 1,
                reviewCount: 1,
                averageRating: 1
            }
        }
    ]);

    // Get revenue chart data (last 30 days)
    const revenueChart = [];
    for (let i = 29; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        // Mock revenue data - in real app, this would come from orders
        const revenue = Math.floor(Math.random() * 1000000) + 100000;
        const orders = Math.floor(Math.random() * 50) + 10;

        revenueChart.push({
            date: startOfDay.toISOString().split('T')[0],
            revenue,
            orders
        });
    }

    // Get category statistics
    const categoryStats = await Product.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryInfo'
            }
        },
        {
            $unwind: '$categoryInfo'
        },
        {
            $group: {
                _id: '$categoryInfo.name',
                count: { $sum: 1 },
                revenue: { $sum: { $multiply: ['$price', 10] } } // Mock revenue calculation
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $limit: 5
        },
        {
            $project: {
                category: '$_id',
                count: 1,
                revenue: 1,
                _id: 0
            }
        }
    ]);

    // Mock recent orders - in real app, this would come from orders collection
    const recentOrders = [
        {
            id: '1',
            customer: 'Nguyễn Văn A',
            total: 1500000,
            status: 'delivered',
            date: new Date()
        },
        {
            id: '2',
            customer: 'Trần Thị B',
            total: 2300000,
            status: 'shipped',
            date: new Date(Date.now() - 24 * 60 * 60 * 1000)
        },
        {
            id: '3',
            customer: 'Lê Văn C',
            total: 800000,
            status: 'pending',
            date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        }
    ];

    const stats: DashboardStats = {
        totalProducts,
        totalOrders: recentOrders.length, // Mock data
        totalRevenue: revenueChart.reduce((sum, day) => sum + day.revenue, 0),
        totalUsers,
        totalContacts,
        recentOrders,
        topProducts,
        revenueChart,
        categoryStats
    };

    res.json({
        success: true,
        data: { stats }
    });
};

// Get revenue data for charts
export const getRevenueData = async (req: Request, res: Response): Promise<void> => {
    const { period = '30d' } = req.query;

    let days = 30;
    if (period === '7d') days = 7;
    else if (period === '90d') days = 90;
    else if (period === '1y') days = 365;

    const revenueChart = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));
        const endOfDay = new Date(date.setHours(23, 59, 59, 999));

        // Mock revenue data - in real app, this would come from orders
        const revenue = Math.floor(Math.random() * 1000000) + 100000;
        const orders = Math.floor(Math.random() * 50) + 10;

        revenueChart.push({
            date: startOfDay.toISOString().split('T')[0],
            revenue,
            orders
        });
    }

    res.json({
        success: true,
        data: { revenueChart }
    });
};

// Get orders data for charts
export const getOrdersData = async (req: Request, res: Response): Promise<void> => {
    const { period = '30d' } = req.query;

    let days = 30;
    if (period === '7d') days = 7;
    else if (period === '90d') days = 90;
    else if (period === '1y') days = 365;

    const ordersChart = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));

        // Mock orders data - in real app, this would come from orders collection
        const orders = Math.floor(Math.random() * 50) + 10;
        const revenue = orders * (Math.floor(Math.random() * 50000) + 50000);

        ordersChart.push({
            date: startOfDay.toISOString().split('T')[0],
            orders,
            revenue
        });
    }

    res.json({
        success: true,
        data: { ordersChart }
    });
};

// Get category sales data
export const getCategoryData = async (req: Request, res: Response): Promise<void> => {
    const categoryStats = await Product.aggregate([
        {
            $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'categoryInfo'
            }
        },
        {
            $unwind: '$categoryInfo'
        },
        {
            $group: {
                _id: '$categoryInfo.name',
                count: { $sum: 1 },
                revenue: { $sum: { $multiply: ['$price', 10] } }, // Mock revenue calculation
                averagePrice: { $avg: '$price' }
            }
        },
        {
            $sort: { count: -1 }
        },
        {
            $project: {
                category: '$_id',
                count: 1,
                revenue: 1,
                averagePrice: 1,
                _id: 0
            }
        }
    ]);

    res.json({
        success: true,
        data: { categoryStats }
    });
};

// Get trends data
export const getTrendsData = async (req: Request, res: Response): Promise<void> => {
    const { period = '30d' } = req.query;

    let days = 30;
    if (period === '7d') days = 7;
    else if (period === '90d') days = 90;
    else if (period === '1y') days = 365;

    const trendsData = [];
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const startOfDay = new Date(date.setHours(0, 0, 0, 0));

        // Mock trends data
        const revenue = Math.floor(Math.random() * 1000000) + 100000;
        const orders = Math.floor(Math.random() * 50) + 10;
        const users = Math.floor(Math.random() * 20) + 5;
        const contacts = Math.floor(Math.random() * 10) + 2;

        trendsData.push({
            date: startOfDay.toISOString().split('T')[0],
            revenue,
            orders,
            users,
            contacts
        });
    }

    res.json({
        success: true,
        data: { trendsData }
    });
};
