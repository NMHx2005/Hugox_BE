import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary, {
    productUploadOptions,
    newsUploadOptions,
    avatarUploadOptions,
    categoryUploadOptions
} from '../config/cloudinary';

// Create Cloudinary storage
const createCloudinaryStorage = (options: any) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: options
    });
};

// Upload configurations
export const productUpload = multer({
    storage: createCloudinaryStorage(productUploadOptions),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 10 // Max 10 files
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

export const newsUpload = multer({
    storage: createCloudinaryStorage(newsUploadOptions),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
        files: 5 // Max 5 files
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

export const avatarUpload = multer({
    storage: createCloudinaryStorage(avatarUploadOptions),
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
        files: 1 // Max 1 file
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

export const categoryUpload = multer({
    storage: createCloudinaryStorage(categoryUploadOptions),
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB
        files: 1 // Max 1 file
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'));
        }
    }
});

// Error handling middleware
export const handleUploadError = (error: any, req: any, res: any, next: any) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File too large. Maximum size is 5MB.'
            });
        }
        if (error.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Too many files. Maximum is 10 files.'
            });
        }
    }

    if (error.message === 'Only image files are allowed!') {
        return res.status(400).json({
            success: false,
            message: 'Only image files are allowed!'
        });
    }

    next(error);
};
