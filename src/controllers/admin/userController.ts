import { Request, Response } from 'express';
import User from '../../models/User';
import { createError } from '../../middleware/errorHandler';

// Get all users for admin
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    const {
        page = 1,
        limit = 12,
        search,
        role,
        isActive,
        sort = '-createdAt'
    } = req.query;

    const filter: any = {};

    if (search) {
        filter.$or = [
            { name: new RegExp(search as string, 'i') },
            { email: new RegExp(search as string, 'i') },
            { phone: new RegExp(search as string, 'i') }
        ];
    }

    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
        User.find(filter)
            .select('-password')
            .sort(sort as string)
            .skip(skip)
            .limit(Number(limit)),
        User.countDocuments(filter)
    ]);

    res.json({
        success: true,
        data: {
            users,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        }
    });
};

// Get single user for admin
export const getUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');

    if (!user) {
        throw createError('User not found', 404);
    }

    res.json({
        success: true,
        data: { user }
    });
};

// Create user
export const createUser = async (req: Request, res: Response): Promise<void> => {
    const userData = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
        throw createError('User already exists with this email', 400);
    }

    const user = await User.create(userData);

    res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: { user }
    });
};

// Update user
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updateData = req.body;

    // Remove password from update data if it's not being changed
    if (!updateData.password) {
        delete updateData.password;
    }

    const user = await User.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
        throw createError('User not found', 404);
    }

    res.json({
        success: true,
        message: 'User updated successfully',
        data: { user }
    });
};


export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await User.findByIdAndDelete(id);

    if (!user) {
        throw createError('User not found', 404);
    }

    res.json({
        success: true,
        message: 'User deleted successfully'
    });
};
