import { Request, Response } from 'express';
import Product from '../../models/Product';
import { createError } from '../../middleware/errorHandler';
import mongoose from 'mongoose';

// Helper function to validate and clean product data
const validateAndCleanProductData = (productData: any) => {
    // Validate and clean purchase links
    if (productData.purchaseLinks) {
        const { shopee, tiktok, facebook, custom } = productData.purchaseLinks;

        // Clean empty values
        const cleanPurchaseLinks: any = {};
        if (shopee && shopee.trim()) cleanPurchaseLinks.shopee = shopee.trim();
        if (tiktok && tiktok.trim()) cleanPurchaseLinks.tiktok = tiktok.trim();
        if (facebook && facebook.trim()) cleanPurchaseLinks.facebook = facebook.trim();

        // Validate custom links
        if (custom && Array.isArray(custom)) {
            cleanPurchaseLinks.custom = custom
                .filter(link => link.platform && link.url && link.platform.trim() && link.url.trim())
                .map(link => ({
                    platform: link.platform.trim(),
                    url: link.url.trim()
                }));
        }

        productData.purchaseLinks = cleanPurchaseLinks;
    }

    // Validate and clean additional info
    if (productData.additionalInfo) {
        productData.additionalInfo = productData.additionalInfo
            .filter((info: any) => info.title && info.content && info.title.trim() && info.content.trim())
            .map((info: any, index: number) => ({
                title: info.title.trim(),
                content: info.content.trim(),
                order: info.order || index
            }));
    }

    // Validate and clean specifications
    if (productData.specifications) {
        productData.specifications = productData.specifications
            .filter((spec: any) => spec.title && spec.content && spec.title.trim() && spec.content.trim())
            .map((spec: any, index: number) => ({
                title: spec.title.trim(),
                content: spec.content.trim(),
                order: spec.order || index
            }));
    }

    // Validate rating fields
    if (productData.rating !== undefined) {
        productData.rating = Math.min(5, Math.max(0, Number(productData.rating) || 0));
    }
    if (productData.qualityRating !== undefined) {
        productData.qualityRating = Math.min(5, Math.max(0, Number(productData.qualityRating) || 0));
    }
    if (productData.deliveryRating !== undefined) {
        productData.deliveryRating = Math.min(5, Math.max(0, Number(productData.deliveryRating) || 5));
    }
    if (productData.warrantyRating !== undefined) {
        productData.warrantyRating = Math.min(5, Math.max(0, Number(productData.warrantyRating) || 5));
    }

    // Validate count fields
    if (productData.reviewsCount !== undefined) {
        productData.reviewsCount = Math.max(0, Number(productData.reviewsCount) || 0);
    }
    if (productData.sold !== undefined) {
        productData.sold = Math.max(0, Number(productData.sold) || 0);
    }

    return productData;
};

// Get all products for admin
export const getProducts = async (req: Request, res: Response): Promise<void> => {
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
            { name: new RegExp(search as string, 'i') },
            { description: new RegExp(search as string, 'i') },
            { sku: new RegExp(search as string, 'i') }
        ];
    }

    if (category) filter.category = category;
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

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

// Get single product for admin
export const getProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const product = await Product.findById(id)
        .populate('category', 'name slug');

    if (!product) {
        throw createError('Product not found', 404);
    }

    res.json({
        success: true,
        data: { product }
    });
};

// Create product
export const createProduct = async (req: Request, res: Response): Promise<void> => {
    const productData = validateAndCleanProductData(req.body);

    const product = await Product.create(productData);

    await product.populate('category', 'name slug');

    res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: { product }
    });
};

// Update product
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = validateAndCleanProductData(req.body);

    const product = await Product.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
        throw createError('Product not found', 404);
    }

    res.json({
        success: true,
        message: 'Product updated successfully',
        data: { product }
    });
};

// Delete product
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
        throw createError('Product not found', 404);
    }

    res.json({
        success: true,
        message: 'Product deleted successfully'
    });
};

// Change product status
export const changeProductStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError('Invalid product ID', 400);
    }

    if (!['active', 'inactive'].includes(status)) {
        throw createError('Status must be either active or inactive', 400);
    }

    const product = await Product.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true, runValidators: true }
    ).populate('category', 'name slug');

    if (!product) {
        throw createError('Product not found', 404);
    }

    res.json({
        success: true,
        message: `Product status changed to ${status}`,
        data: { product }
    });
};
