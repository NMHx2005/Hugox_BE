import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
    general: {
        siteName: string;
        siteDescription: string;
        siteUrl: string;
        adminEmail: string;
        supportEmail: string;
        phone: string;
        address: string;
        zalo: string;
        facebook: string;
        youtube: string;
        logo: string;
        favicon: string;
        theme: string;
        language: string;
        currency: string;
        timezone: string;
    };
    payment: {
        vnpay: {
            enabled: boolean;
            merchantId: string;
            secretKey: string;
            returnUrl: string;
            cancelUrl: string;
        };
        momo: {
            enabled: boolean;
            partnerCode: string;
            accessKey: string;
            secretKey: string;
        };
        cod: {
            enabled: boolean;
            fee: number;
        };
    };
    shipping: {
        freeShippingThreshold: number;
        shippingRates: Array<{
            name: string;
            price: number;
            estimatedDays: string;
        }>;
    };
    seo: {
        metaTitle: string;
        metaDescription: string;
        metaKeywords: string;
        googleAnalytics: string;
        facebookPixel: string;
    };
    updatedAt: Date;
}

const settingsSchema = new Schema<ISettings>({
    general: {
        siteName: {
            type: String,
            required: true,
            default: 'HugoX E-commerce'
        },
        siteDescription: {
            type: String,
            required: true,
            default: 'Hệ thống thương mại điện tử chuyên nghiệp'
        },
        siteUrl: {
            type: String,
            required: true,
            default: 'https://hugox.com'
        },
        adminEmail: {
            type: String,
            required: true,
            default: 'admin@hugox.com'
        },
        supportEmail: {
            type: String,
            required: true,
            default: 'support@hugox.com'
        },
        phone: {
            type: String,
            required: true,
            default: '08.7878.4842'
        },
        address: {
            type: String,
            required: true,
            default: '27 Đoàn Thị Điểm - Phường Sông Cầu - Dăk Lăk'
        },
        zalo: {
            type: String,
            default: 'https://zalo.me/0878784842'
        },
        facebook: {
            type: String,
            default: 'https://facebook.com/hugox'
        },
        youtube: {
            type: String,
            default: 'https://youtube.com/hugox'
        },
        logo: {
            type: String,
            default: '/logo.png'
        },
        favicon: {
            type: String,
            default: '/favicon.ico'
        },
        theme: {
            type: String,
            default: 'light'
        },
        language: {
            type: String,
            default: 'vi'
        },
        currency: {
            type: String,
            default: 'VND'
        },
        timezone: {
            type: String,
            default: 'Asia/Ho_Chi_Minh'
        }
    },
    payment: {
        vnpay: {
            enabled: {
                type: Boolean,
                default: true
            },
            merchantId: {
                type: String,
                default: 'your-merchant-id'
            },
            secretKey: {
                type: String,
                default: 'your-secret-key'
            },
            returnUrl: {
                type: String,
                default: 'https://hugox.com/payment/return'
            },
            cancelUrl: {
                type: String,
                default: 'https://hugox.com/payment/cancel'
            }
        },
        momo: {
            enabled: {
                type: Boolean,
                default: true
            },
            partnerCode: {
                type: String,
                default: 'your-partner-code'
            },
            accessKey: {
                type: String,
                default: 'your-access-key'
            },
            secretKey: {
                type: String,
                default: 'your-secret-key'
            }
        },
        cod: {
            enabled: {
                type: Boolean,
                default: true
            },
            fee: {
                type: Number,
                default: 0
            }
        }
    },
    shipping: {
        freeShippingThreshold: {
            type: Number,
            default: 500000
        },
        shippingRates: [{
            name: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            estimatedDays: {
                type: String,
                required: true
            }
        }]
    },
    seo: {
        metaTitle: {
            type: String,
            default: 'HugoX - Thương mại điện tử chuyên nghiệp'
        },
        metaDescription: {
            type: String,
            default: 'Hệ thống thương mại điện tử với đầy đủ tính năng quản lý sản phẩm, đơn hàng và khách hàng'
        },
        metaKeywords: {
            type: String,
            default: 'ecommerce, thương mại điện tử, bán hàng online'
        },
        googleAnalytics: {
            type: String,
            default: ''
        },
        facebookPixel: {
            type: String,
            default: ''
        }
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Ensure only one settings document exists
settingsSchema.index({}, { unique: true });

export default mongoose.model<ISettings>('Settings', settingsSchema);
