import { v2 as cloudinary } from 'cloudinary';
import { config } from './config';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export default cloudinary;

// Upload options
export const uploadOptions = {
    folder: 'hugox-ecommerce',
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: 'auto' as const,
    transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' }
    ]
};

// Product image upload options
export const productUploadOptions = {
    folder: 'hugox-ecommerce/products',
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: 'image' as const,
    transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
        { width: 800, height: 800, crop: 'limit' }
    ]
};

// News image upload options
export const newsUploadOptions = {
    folder: 'hugox-ecommerce/news',
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: 'image' as const,
    transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
        { width: 1200, height: 630, crop: 'limit' }
    ]
};

// Avatar upload options
export const avatarUploadOptions = {
    folder: 'hugox-ecommerce/avatars',
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: 'image' as const,
    transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
        { width: 300, height: 300, crop: 'fill', gravity: 'face' }
    ]
};

// Category image upload options
export const categoryUploadOptions = {
    folder: 'hugox-ecommerce/categories',
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: 'image' as const,
    transformation: [
        { quality: 'auto' },
        { fetch_format: 'auto' },
        { width: 400, height: 400, crop: 'limit' }
    ]
};
