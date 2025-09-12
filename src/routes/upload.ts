import express from 'express';
import {
    uploadSingleImage,
    uploadMultipleImages,
    deleteImage,
    getImageInfo,
    transformImage
} from '../controllers/uploadController';
import {
    productUpload,
    newsUpload,
    avatarUpload,
    categoryUpload,
    handleUploadError
} from '../middleware/upload';
import { authenticate, authorize } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = express.Router();

// All upload routes require authentication
router.use(authenticate);

// Product image uploads
router.post('/products/single',
    productUpload.single('image'),
    handleUploadError,
    asyncHandler(uploadSingleImage)
);

router.post('/products/multiple',
    productUpload.array('images', 10),
    handleUploadError,
    asyncHandler(uploadMultipleImages)
);

// News image uploads
router.post('/news/single',
    newsUpload.single('image'),
    handleUploadError,
    asyncHandler(uploadSingleImage)
);

router.post('/news/multiple',
    newsUpload.array('images', 5),
    handleUploadError,
    asyncHandler(uploadMultipleImages)
);

// Avatar uploads
router.post('/avatars',
    avatarUpload.single('avatar'),
    handleUploadError,
    asyncHandler(uploadSingleImage)
);

// Category image uploads
router.post('/categories',
    categoryUpload.single('image'),
    handleUploadError,
    asyncHandler(uploadSingleImage)
);

// Settings image uploads (logo, favicon)
router.post('/settings/logo',
    productUpload.single('logo'),
    handleUploadError,
    asyncHandler(uploadSingleImage)
);

router.post('/settings/favicon',
    productUpload.single('favicon'),
    handleUploadError,
    asyncHandler(uploadSingleImage)
);

// General image operations
router.delete('/:public_id', asyncHandler(deleteImage));
router.get('/:public_id/info', asyncHandler(getImageInfo));
router.get('/:public_id/transform', asyncHandler(transformImage));

export default router;
