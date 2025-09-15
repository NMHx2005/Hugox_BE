import { Request, Response } from 'express';
import Category from '../../models/Category';
import { createError } from '../../middleware/errorHandler';
import mongoose from 'mongoose';

// Get all categories for admin (with search, status, pagination)
export const getCategories = async (req: Request, res: Response): Promise<void> => {
    const {
        page = 1,
        limit = 50,
        search,
        status,
        sort = 'sortOrder name'
    } = req.query;

    const filter: any = {};
    if (search) {
        filter.$or = [
            { name: new RegExp(search as string, 'i') },
            { slug: new RegExp(search as string, 'i') },
            { description: new RegExp(search as string, 'i') }
        ];
    }
    if (status) filter.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [categories, total] = await Promise.all([
        Category.find(filter)
            .populate('parent', 'name slug')
            .sort(sort as string)
            .skip(skip)
            .limit(Number(limit)),
        Category.countDocuments(filter)
    ]);

    res.json({
        success: true,
        data: {
            categories,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        }
    });
};

// Get single category for admin
export const getCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const category = await Category.findById(id)
        .populate('parent', 'name slug');

    if (!category) {
        throw createError('Category not found', 404);
    }

    res.json({
        success: true,
        data: { category }
    });
};

// Create category
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    const categoryData = req.body;

    const category = await Category.create(categoryData);

    await category.populate('parent', 'name slug');

    res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: { category }
    });
};

// Update category
export const updateCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;

    const category = await Category.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).populate('parent', 'name slug');

    if (!category) {
        throw createError('Category not found', 404);
    }

    res.json({
        success: true,
        message: 'Category updated successfully',
        data: { category }
    });
};

// Delete category
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const category = await Category.findByIdAndDelete(id);

    if (!category) {
        throw createError('Category not found', 404);
    }

    res.json({
        success: true,
        message: 'Category deleted successfully'
    });
};

// Change category status
export const changeCategoryStatus = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw createError('Invalid category ID', 400);
    }

    if (!['active', 'inactive'].includes(status)) {
        throw createError('Status must be either active or inactive', 400);
    }

    const category = await Category.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true, runValidators: true }
    ).populate('parent', 'name slug');

    if (!category) {
        throw createError('Category not found', 404);
    }

    res.json({
        success: true,
        message: `Category status changed to ${status}`,
        data: { category }
    });
};
