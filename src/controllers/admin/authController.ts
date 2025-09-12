import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../../models/User';
import { config } from '../../config/config';
import { createError } from '../../middleware/errorHandler';
import { AuthRequest } from '../../middleware/auth';

// Generate JWT token
const generateToken = (userId: string): string => {
    return jwt.sign(
        { userId },
        config.jwtSecret as string,
        { expiresIn: config.jwtExpire as any }
    );
};

// Admin login
export const adminLogin = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    // Find admin user
    const admin = await User.findOne({ email, role: 'admin' }).select('+password');
    if (!admin) {
        throw createError('Invalid admin credentials', 401);
    }

    // Check if admin is active
    if (!admin.isActive) {
        throw createError('Admin account is deactivated', 401);
    }

    // Check password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
        throw createError('Invalid admin credentials', 401);
    }

    // Generate token
    const token = generateToken(admin._id.toString());

    res.json({
        success: true,
        message: 'Admin login successful',
        data: {
            user: {
                _id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                isActive: admin.isActive
            },
            token
        }
    });

};

// Admin logout
export const adminLogout = async (req: AuthRequest, res: Response): Promise<void> => {
    res.json({
        success: true,
        message: 'Admin logout successful'
    });
};

// Get admin profile
export const getAdminProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const admin = await User.findById(req.userId);
    if (!admin) {
        throw createError('Admin not found', 404);
    }

    res.json({
        success: true,
        data: {
            user: {
                _id: admin._id,
                email: admin.email,
                name: admin.name,
                role: admin.role,
                isActive: admin.isActive
            }
        }
    });
};
