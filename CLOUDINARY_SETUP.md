# Cloudinary Setup Guide

## 🚀 Cài đặt Cloudinary

### 1. Tạo tài khoản Cloudinary
1. Truy cập [https://cloudinary.com](https://cloudinary.com)
2. Đăng ký tài khoản miễn phí
3. Xác thực email

### 2. Lấy thông tin API
1. Đăng nhập vào Dashboard
2. Vào **Settings** > **Security**
3. Copy các thông tin sau:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### 3. Cấu hình Environment Variables
Cập nhật file `.env`:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

## 📁 Cấu trúc thư mục Cloudinary

```
hugox-ecommerce/
├── products/          # Ảnh sản phẩm
├── news/             # Ảnh tin tức
├── avatars/          # Ảnh đại diện
├── categories/       # Ảnh danh mục
└── reviews/          # Ảnh đánh giá
```

## 🔧 API Endpoints

### Upload Ảnh Sản Phẩm
```bash
# Upload 1 ảnh
POST /api/upload/products/single
Content-Type: multipart/form-data
Authorization: Bearer <token>

# Upload nhiều ảnh (tối đa 10)
POST /api/upload/products/multiple
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

### Upload Ảnh Tin Tức
```bash
# Upload 1 ảnh
POST /api/upload/news/single
Content-Type: multipart/form-data
Authorization: Bearer <token>

# Upload nhiều ảnh (tối đa 5)
POST /api/upload/news/multiple
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

### Upload Avatar
```bash
POST /api/upload/avatars
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

### Upload Ảnh Danh Mục
```bash
POST /api/upload/categories
Content-Type: multipart/form-data
Authorization: Bearer <token>
```

### Quản lý Ảnh
```bash
# Xóa ảnh
DELETE /api/upload/:public_id
Authorization: Bearer <token>

# Lấy thông tin ảnh
GET /api/upload/:public_id/info
Authorization: Bearer <token>

# Transform ảnh
GET /api/upload/:public_id/transform?width=300&height=300&crop=fill
Authorization: Bearer <token>
```

## 📝 Response Format

### Upload thành công
```json
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "public_id": "hugox-ecommerce/products/product_123",
    "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/hugox-ecommerce/products/product_123.jpg",
    "url": "http://res.cloudinary.com/your-cloud/image/upload/v1234567890/hugox-ecommerce/products/product_123.jpg",
    "width": 800,
    "height": 600,
    "format": "jpg",
    "bytes": 245760
  }
}
```

### Upload nhiều ảnh
```json
{
  "success": true,
  "message": "Images uploaded successfully",
  "data": {
    "images": [
      {
        "public_id": "hugox-ecommerce/products/product_123_1",
        "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/hugox-ecommerce/products/product_123_1.jpg",
        "url": "http://res.cloudinary.com/your-cloud/image/upload/v1234567890/hugox-ecommerce/products/product_123_1.jpg",
        "width": 800,
        "height": 600,
        "format": "jpg",
        "bytes": 245760
      },
      {
        "public_id": "hugox-ecommerce/products/product_123_2",
        "secure_url": "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/hugox-ecommerce/products/product_123_2.jpg",
        "url": "http://res.cloudinary.com/your-cloud/image/upload/v1234567890/hugox-ecommerce/products/product_123_2.jpg",
        "width": 800,
        "height": 600,
        "format": "jpg",
        "bytes": 198432
      }
    ]
  }
}
```

## 🎨 Image Transformations

### Resize ảnh
```bash
GET /api/upload/:public_id/transform?width=300&height=300&crop=fill
```

### Chất lượng ảnh
```bash
GET /api/upload/:public_id/transform?quality=auto
```

### Format ảnh
```bash
GET /api/upload/:public_id/transform?format=webp
```

### Watermark (nếu cần)
```bash
GET /api/upload/:public_id/transform?overlay=logo&gravity=south_east&x=10&y=10
```

## 🔒 Bảo mật

### 1. Upload Signatures (Khuyến nghị cho production)
```javascript
// Tạo upload signature
const timestamp = Math.round(new Date().getTime() / 1000);
const signature = cloudinary.utils.api_sign_request({
  timestamp: timestamp,
  folder: 'hugox-ecommerce/products'
}, process.env.CLOUDINARY_API_SECRET);
```

### 2. Upload Presets
Tạo upload presets trong Cloudinary Dashboard để kiểm soát tốt hơn:
- **Allowed formats**: jpg, png, webp
- **Max file size**: 5MB
- **Max dimensions**: 2000x2000
- **Auto optimization**: enabled

## 📊 Monitoring

### 1. Cloudinary Dashboard
- Xem usage và bandwidth
- Quản lý ảnh
- Analytics

### 2. Logs
```javascript
// Log upload activities
console.log('Upload successful:', {
  public_id: result.public_id,
  size: result.bytes,
  format: result.format
});
```

## 🚀 Production Tips

### 1. CDN
Cloudinary tự động cung cấp CDN toàn cầu

### 2. Auto Optimization
```javascript
// Tự động tối ưu ảnh
transformation: [
  { quality: 'auto' },
  { fetch_format: 'auto' }
]
```

### 3. Responsive Images
```javascript
// Tạo nhiều kích thước
const sizes = [300, 600, 900, 1200];
const responsiveUrls = sizes.map(size => 
  cloudinary.url(public_id, { width: size, crop: 'limit' })
);
```

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Invalid API credentials**
   - Kiểm tra lại Cloud Name, API Key, API Secret

2. **File too large**
   - Tăng limit trong multer config
   - Hoặc resize ảnh trước khi upload

3. **Invalid file type**
   - Chỉ cho phép: jpg, jpeg, png, gif, webp

4. **Rate limit exceeded**
   - Cloudinary free plan có giới hạn 25GB storage
   - Upgrade plan nếu cần

## 📞 Support

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com)
- [Cloudinary Community](https://community.cloudinary.com)
