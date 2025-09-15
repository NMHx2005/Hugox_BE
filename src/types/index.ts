import { Request } from 'express';
import { Document } from 'mongoose';

// User Types
export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

// Product Types
export interface IProduct extends Document {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: string;
  subcategory?: string;
  brand?: string;
  sku?: string;
  stock: number;
  status: 'active' | 'inactive' | 'draft';
  featured: boolean;
  specifications?: Array<{
    title: string;
    content: string;
    order?: number;
  }>;
  attributes?: Record<string, any>;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  purchaseLinks?: {
    shopee?: string;
    tiktok?: string;
    facebook?: string;
    custom?: Array<{
      platform: string;
      url: string;
    }>;
  };
  additionalInfo?: Array<{
    title: string;
    content: string;
    order?: number;
  }>;
  // Rating and Review Information
  rating?: number;
  reviewsCount?: number;
  sold?: number;
  // Quality Metrics
  qualityRating?: number;
  deliveryRating?: number;
  warrantyRating?: number;
  createdAt: Date;
  updatedAt: Date;
}

// Category Types
export interface ICategory extends Document {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parent?: string;
  image?: string;
  status: 'active' | 'inactive';
  sortOrder: number;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

// News Types
export interface INews extends Document {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  category: string;
  author: string;
  featuredImage?: string;
  images?: string[];
  status: 'draft' | 'published' | 'archived';
  featured: boolean;
  tags?: string[];
  seoTitle?: string;
  seoDescription?: string;
  views: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Review Types
export interface IReview extends Document {
  _id: string;
  product: string;
  user: string;
  rating: number;
  title?: string;
  comment: string;
  images?: string[];
  likes: number;
  dislikes: number;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

// Contact/Lead Types
export interface IContact extends Document {
  _id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  content: string;
  status: 'new' | 'contacted' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  assignedTo?: string;
  notes?: string;
  source: 'website' | 'phone' | 'email' | 'social';
  createdAt: Date;
  updatedAt: Date;
}

// Order Types (if needed)
export interface IOrder extends Document {
  _id: string;
  user: string;
  items: Array<{
    product: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    ward: string;
  };
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload Types
export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

// Request Types
export interface AuthRequest extends Request {
  user?: IUser;
  userId?: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Pagination Types
export interface PaginationQuery {
  page?: string;
  limit?: string;
  sort?: string;
  search?: string;
}

// Filter Types
export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  brand?: string;
  status?: string;
  featured?: boolean;
  search?: string;
}

export interface NewsFilters {
  category?: string;
  status?: string;
  featured?: boolean;
  search?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalUsers: number;
  totalContacts: number;
  recentOrders: any[];
  topProducts: any[];
  revenueChart: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
  categoryStats: Array<{
    category: string;
    count: number;
    revenue: number;
  }>;
}
