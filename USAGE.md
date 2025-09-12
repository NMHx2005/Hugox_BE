# HugoX Backend API - Hướng dẫn sử dụng

## 🚀 Khởi chạy dự án

### 1. Cài đặt dependencies
```bash
npm install
```

### 2. Cấu hình môi trường
```bash
# Copy file cấu hình mẫu
cp env.example .env

# Chỉnh sửa file .env với thông tin của bạn
```

### 3. Chạy development
```bash
npm run dev
```

### 4. Chạy production
```bash
npm run build
npm start
```

## 📁 Cấu trúc dự án

```
src/
├── config/          # Cấu hình database, cloudinary
├── controllers/     # Controllers xử lý logic
│   ├── admin/       # Admin controllers
│   └── ...          # Client controllers
├── middleware/      # Middleware functions
├── models/          # Mongoose models
├── routes/          # API routes
│   ├── admin/       # Admin routes
│   └── ...          # Client routes
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
├── validators/      # Validation schemas
└── index.ts         # Entry point
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Đăng ký user
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/profile` - Lấy thông tin profile
- `PUT /api/auth/profile` - Cập nhật profile

### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/products/featured` - Sản phẩm nổi bật
- `GET /api/products/:id/related` - Sản phẩm liên quan
- `GET /api/products/search` - Tìm kiếm sản phẩm

### Categories
- `GET /api/categories` - Danh sách danh mục
- `GET /api/categories/:id` - Chi tiết danh mục
- `GET /api/categories/:id/products` - Sản phẩm theo danh mục

### News
- `GET /api/news` - Danh sách tin tức
- `GET /api/news/:id` - Chi tiết tin tức
- `GET /api/news/featured` - Tin tức nổi bật
- `GET /api/news/category/:category` - Tin tức theo danh mục

### Reviews
- `GET /api/reviews` - Danh sách đánh giá
- `GET /api/reviews/:id` - Chi tiết đánh giá
- `GET /api/reviews/product/:productId` - Đánh giá theo sản phẩm
- `POST /api/reviews` - Tạo đánh giá (cần auth)
- `POST /api/reviews/:id/like` - Like đánh giá
- `POST /api/reviews/:id/dislike` - Dislike đánh giá

### Contact
- `POST /api/contact` - Gửi form liên hệ
- `POST /api/contact/agent` - Đăng ký làm đại lý

### Upload (Cloudinary)
- `POST /api/upload/products/single` - Upload 1 ảnh sản phẩm
- `POST /api/upload/products/multiple` - Upload nhiều ảnh sản phẩm
- `POST /api/upload/news/single` - Upload 1 ảnh tin tức
- `POST /api/upload/news/multiple` - Upload nhiều ảnh tin tức
- `POST /api/upload/avatars` - Upload avatar
- `POST /api/upload/categories` - Upload ảnh danh mục
- `DELETE /api/upload/:public_id` - Xóa ảnh
- `GET /api/upload/:public_id/info` - Lấy thông tin ảnh
- `GET /api/upload/:public_id/transform` - Transform ảnh

### Admin APIs
- `POST /api/admin/auth/login` - Đăng nhập admin
- `GET /api/admin/dashboard/stats` - Thống kê tổng quan
- `GET /api/admin/products` - Danh sách sản phẩm admin
- `POST /api/admin/products` - Tạo sản phẩm
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/products/:id` - Xóa sản phẩm
- `GET /api/admin/categories` - Danh sách danh mục admin
- `POST /api/admin/categories` - Tạo danh mục
- `PUT /api/admin/categories/:id` - Cập nhật danh mục
- `DELETE /api/admin/categories/:id` - Xóa danh mục
- `GET /api/admin/news` - Danh sách tin tức admin
- `POST /api/admin/news` - Tạo tin tức
- `PUT /api/admin/news/:id` - Cập nhật tin tức
- `DELETE /api/admin/news/:id` - Xóa tin tức
- `GET /api/admin/reviews` - Danh sách đánh giá admin
- `PUT /api/admin/reviews/:id/status` - Cập nhật trạng thái đánh giá
- `DELETE /api/admin/reviews/:id` - Xóa đánh giá
- `GET /api/admin/contacts` - Danh sách liên hệ admin
- `GET /api/admin/contacts/:id` - Chi tiết liên hệ
- `PUT /api/admin/contacts/:id/status` - Cập nhật trạng thái liên hệ
- `DELETE /api/admin/contacts/:id` - Xóa liên hệ
- `GET /api/admin/users` - Danh sách users admin
- `POST /api/admin/users` - Tạo user
- `PUT /api/admin/users/:id` - Cập nhật user
- `DELETE /api/admin/users/:id` - Xóa user
- `GET /api/admin/settings` - Lấy cài đặt
- `PUT /api/admin/settings` - Cập nhật cài đặt

## 🔒 Authentication

### JWT Token
Tất cả API cần authentication đều yêu cầu JWT token:

```bash
Authorization: Bearer <your-jwt-token>
```

### Cookie Authentication
Token cũng có thể được gửi qua cookies:

```bash
Cookie: token=<your-jwt-token>
```

## 📝 Response Format

### Success Response
```json
{
  "success": true,
  "message": "Success message",
  "data": {
    // Response data
  },
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 100,
    "pages": 9
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## 🚀 Upload Images với Cloudinary

### 1. Cấu hình Cloudinary
```env
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

### 2. Upload ảnh sản phẩm
```bash
curl -X POST http://localhost:3000/api/upload/products/single \
  -H "Authorization: Bearer <token>" \
  -F "image=@product.jpg"
```

### 3. Upload nhiều ảnh
```bash
curl -X POST http://localhost:3000/api/upload/products/multiple \
  -H "Authorization: Bearer <token>" \
  -F "images=@image1.jpg" \
  -F "images=@image2.jpg"
```

## 🐳 Docker

### Chạy với Docker Compose
```bash
docker-compose up -d
```

### Chạy riêng lẻ
```bash
# Build image
docker build -t hugox-backend .

# Run container
docker run -p 3000:3000 hugox-backend
```

## 📊 Monitoring

### Health Check
```bash
GET http://localhost:3000/health
```

### Logs
```bash
# Development
npm run dev

# Production
npm start
```

## 🔧 Development

### Linting
```bash
npm run lint
npm run lint:fix
```

### Testing
```bash
npm test
npm run test:watch
```

### Build
```bash
npm run build
npm run clean
```

## 📞 Support

- **Documentation**: [API Docs](http://localhost:3000/api-docs)
- **Issues**: [GitHub Issues](https://github.com/hugox/backend/issues)
- **Email**: support@hugox.com

## 🔄 Changelog

### v1.0.0
- ✅ Basic CRUD operations
- ✅ Authentication system
- ✅ Admin panel APIs
- ✅ Client APIs
- ✅ Cloudinary integration
- ✅ File upload support
- ✅ Rate limiting
- ✅ Security middleware
- ✅ Docker support
