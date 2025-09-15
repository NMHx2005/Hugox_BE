import mongoose, { Schema, Document } from 'mongoose';
import { IProduct } from '../types';

const productSchema = new Schema<IProduct>({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [200, 'Product name cannot be more than 200 characters']
    },
    slug: {
        type: String,
        required: [true, 'Product slug is required'],
        unique: true,
        lowercase: true,
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true
    },
    shortDescription: {
        type: String,
        trim: true,
        maxlength: [500, 'Short description cannot be more than 500 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    originalPrice: {
        type: Number,
        min: [0, 'Original price cannot be negative']
    },
    images: [{
        type: String,
        required: [true, 'At least one product image is required']
    }],
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: [true, 'Product category is required']
    } as any,
    subcategory: {
        type: String,
        trim: true
    },
    brand: {
        type: String,
        trim: true
    },
    sku: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    stock: {
        type: Number,
        required: [true, 'Stock quantity is required'],
        min: [0, 'Stock cannot be negative'],
        default: 0
    },
    status: {
        type: String,
        enum: ['active', 'inactive', 'draft'],
        default: 'draft'
    },
    featured: {
        type: Boolean,
        default: false
    },
    specifications: [{
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: [200, 'Specification title cannot be more than 200 characters']
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    attributes: {
        type: Map,
        of: Schema.Types.Mixed
    },
    tags: [{
        type: String,
        trim: true
    }],
    seoTitle: {
        type: String,
        trim: true,
        maxlength: [60, 'SEO title cannot be more than 60 characters']
    },
    seoDescription: {
        type: String,
        trim: true,
        maxlength: [160, 'SEO description cannot be more than 160 characters']
    },
    purchaseLinks: {
        shopee: {
            type: String,
            trim: true
        },
        tiktok: {
            type: String,
            trim: true
        },
        facebook: {
            type: String,
            trim: true
        },
        custom: [{
            platform: {
                type: String,
                required: true,
                trim: true
            },
            url: {
                type: String,
                required: true,
                trim: true
            }
        }]
    },
    additionalInfo: [{
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: [200, 'Title cannot be more than 200 characters']
        },
        content: {
            type: String,
            required: true,
            trim: true
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    // Rating and Review Information
    rating: {
        type: Number,
        min: [0, 'Rating cannot be negative'],
        max: [5, 'Rating cannot be more than 5'],
        default: 0
    },
    reviewsCount: {
        type: Number,
        min: [0, 'Reviews count cannot be negative'],
        default: 0
    },
    sold: {
        type: Number,
        min: [0, 'Sold count cannot be negative'],
        default: 0
    },
    // Quality Metrics
    qualityRating: {
        type: Number,
        min: [0, 'Quality rating cannot be negative'],
        max: [5, 'Quality rating cannot be more than 5'],
        default: 0
    },
    deliveryRating: {
        type: Number,
        min: [0, 'Delivery rating cannot be negative'],
        max: [5, 'Delivery rating cannot be more than 5'],
        default: 5
    },
    warrantyRating: {
        type: Number,
        min: [0, 'Warranty rating cannot be negative'],
        max: [5, 'Warranty rating cannot be more than 5'],
        default: 5
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ status: 1 });
productSchema.index({ featured: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
    if (this.originalPrice && this.originalPrice > this.price) {
        return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
    }
    return 0;
});

// Virtual for availability status
productSchema.virtual('isAvailable').get(function () {
    return this.status === 'active' && this.stock > 0;
});

// Pre-save middleware to generate slug if not provided
productSchema.pre('save', function (next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^a-z0-9 -]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    }
    next();
});

// Static method to find products by category
productSchema.statics.findByCategory = function (categoryId: string) {
    return this.find({ category: categoryId, status: 'active' });
};

// Static method to find featured products
productSchema.statics.findFeatured = function () {
    return this.find({ featured: true, status: 'active' });
};

export default mongoose.model<IProduct>('Product', productSchema);
