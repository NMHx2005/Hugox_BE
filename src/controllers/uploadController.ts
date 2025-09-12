import { Request, Response } from 'express';
import cloudinary from '../config/cloudinary';
import { createError } from '../middleware/errorHandler';

// Upload single image
export const uploadSingleImage = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.file) {
            throw createError('No file uploaded', 400);
        }

        const f = req.file as any;
        const secureUrl = f?.secure_url || f?.path || f?.url;
        const publicId = f?.public_id || f?.filename;

        res.json({
            success: true,
            message: 'Image uploaded successfully',
            data: {
                public_id: publicId,
                secure_url: secureUrl,
                url: secureUrl,
                width: f?.width,
                height: f?.height,
                format: f?.format || f?.mimetype,
                bytes: f?.bytes || f?.size
            }
        });
    } catch (error) {
        throw createError('Upload failed', 500);
    }
};

// Upload multiple images
export const uploadMultipleImages = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.files || (req.files as any[]).length === 0) {
            throw createError('No files uploaded', 400);
        }

        const files = req.files as any[];
        const results = files.map(file => {
            const secureUrl = file?.secure_url || file?.path || file?.url;
            const publicId = file?.public_id || file?.filename;
            return {
                public_id: publicId,
                secure_url: secureUrl,
                url: secureUrl,
                width: file?.width,
                height: file?.height,
                format: file?.format || file?.mimetype,
                bytes: file?.bytes || file?.size
            };
        });

        res.json({
            success: true,
            message: 'Images uploaded successfully',
            data: { images: results }
        });
    } catch (error) {
        throw createError('Upload failed', 500);
    }
};

// Delete image
export const deleteImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { public_id } = req.params;

        if (!public_id) {
            throw createError('Public ID is required', 400);
        }

        const result = await cloudinary.uploader.destroy(public_id);

        if (result.result === 'not found') {
            throw createError('Image not found', 404);
        }

        res.json({
            success: true,
            message: 'Image deleted successfully',
            data: { result }
        });
    } catch (error) {
        throw createError('Delete failed', 500);
    }
};

// Get image info
export const getImageInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const { public_id } = req.params;

        if (!public_id) {
            throw createError('Public ID is required', 400);
        }

        const result = await cloudinary.api.resource(public_id);

        res.json({
            success: true,
            data: { image: result }
        });
    } catch (error) {
        throw createError('Failed to get image info', 500);
    }
};

// Transform image (resize, crop, etc.)
export const transformImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const { public_id } = req.params;
        const { width, height, crop, quality, format } = req.query;

        if (!public_id) {
            throw createError('Public ID is required', 400);
        }

        const transformation: any = {};
        if (width) transformation.width = Number(width);
        if (height) transformation.height = Number(height);
        if (crop) transformation.crop = crop;
        if (quality) transformation.quality = quality;
        if (format) transformation.fetch_format = format;

        const url = cloudinary.url(public_id, { transformation });

        res.json({
            success: true,
            data: { transformed_url: url }
        });
    } catch (error) {
        throw createError('Image transformation failed', 500);
    }
};
