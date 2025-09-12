# HugoX E-commerce Backend API

Backend API cho hệ thống thương mại điện tử HugoX, được xây dựng với Express.js, TypeScript và MongoDB.

## 🚀 Tính năng

### Client APIs
- **Authentication**: Đăng ký, đăng nhập, quản lý profile
- **Products**: Danh sách sản phẩm, chi tiết, tìm kiếm, sản phẩm nổi bật
- **Categories**: Danh mục sản phẩm, sản phẩm theo danh mục
- **News**: Tin tức, bài viết, danh mục tin tức
- **Reviews**: Đánh giá sản phẩm, like/dislike
- **Contact**: Form liên hệ, đăng ký đại lý

### Admin APIs
- **Dashboard**: Thống kê tổng quan, biểu đồ
- **Product Management**: CRUD sản phẩm
- **Category Management**: CRUD danh mục
- **News Management**: CRUD tin tức
- **Review Management**: Quản lý đánh giá
- **Contact Management**: Quản lý liên hệ/leads
- **User Management**: Quản lý người dùng
- **Settings**: Cài đặt hệ thống

## 🛠️ Công nghệ sử dụng

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB với Mongoose
- **Authentication**: JWT
- **Validation**: Express Validator
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 18.0.0 hoặc cao hơn
- MongoDB 4.4 hoặc cao hơn
- npm 8.0.0 hoặc cao hơn

### Cài đặt dependencies
```bash
npm install
```

### Cấu hình môi trường
```bash
# Copy file cấu hình mẫu
cp env.example .env

# Chỉnh sửa file .env với thông tin của bạn
```

### Biến môi trường cần thiết
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/hugox_ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# CORS Configuration
FRONTEND_URL=http://localhost:5173
ADMIN_FRONTEND_URL=http://localhost:5173/admin
```

## 🚀 Chạy ứng dụng

### Development
```bash
npm run dev
```

### Production
```bash
# Build
npm run build

# Start
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Client Endpoints

#### Authentication
- `POST /api/auth/register` - Đăng ký user
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất
- `GET /api/auth/profile` - Lấy thông tin profile
- `PUT /api/auth/profile` - Cập nhật profile

#### Products
- `GET /api/products` - Danh sách sản phẩm
- `GET /api/products/:id` - Chi tiết sản phẩm
- `GET /api/products/featured` - Sản phẩm nổi bật
- `GET /api/products/:id/related` - Sản phẩm liên quan
- `GET /api/products/search` - Tìm kiếm sản phẩm

#### Categories
- `GET /api/categories` - Danh sách danh mục
- `GET /api/categories/:id` - Chi tiết danh mục
- `GET /api/categories/:id/products` - Sản phẩm theo danh mục

#### News
- `GET /api/news` - Danh sách tin tức
- `GET /api/news/:id` - Chi tiết tin tức
- `GET /api/news/featured` - Tin tức nổi bật
- `GET /api/news/category/:category` - Tin tức theo danh mục

#### Reviews
- `GET /api/reviews` - Danh sách đánh giá
- `GET /api/reviews/:id` - Chi tiết đánh giá
- `GET /api/reviews/product/:productId` - Đánh giá theo sản phẩm
- `POST /api/reviews` - Tạo đánh giá (cần auth)
- `POST /api/reviews/:id/like` - Like đánh giá
- `POST /api/reviews/:id/dislike` - Dislike đánh giá

#### Contact
- `POST /api/contact` - Gửi form liên hệ
- `POST /api/contact/agent` - Đăng ký làm đại lý

### Admin Endpoints

#### Authentication
- `POST /api/admin/auth/login` - Đăng nhập admin
- `POST /api/admin/auth/logout` - Đăng xuất admin
- `GET /api/admin/auth/profile` - Profile admin

#### Dashboard
- `GET /api/admin/dashboard/stats` - Thống kê tổng quan

#### Products
- `GET /api/admin/products` - Danh sách sản phẩm admin
- `POST /api/admin/products` - Tạo sản phẩm
- `PUT /api/admin/products/:id` - Cập nhật sản phẩm
- `DELETE /api/admin/products/:id` - Xóa sản phẩm

#### Categories
- `GET /api/admin/categories` - Danh sách danh mục admin
- `POST /api/admin/categories` - Tạo danh mục
- `PUT /api/admin/categories/:id` - Cập nhật danh mục
- `DELETE /api/admin/categories/:id` - Xóa danh mục

#### News
- `GET /api/admin/news` - Danh sách tin tức admin
- `POST /api/admin/news` - Tạo tin tức
- `PUT /api/admin/news/:id` - Cập nhật tin tức
- `DELETE /api/admin/news/:id` - Xóa tin tức

#### Reviews
- `GET /api/admin/reviews` - Danh sách đánh giá admin
- `PUT /api/admin/reviews/:id/status` - Cập nhật trạng thái đánh giá
- `DELETE /api/admin/reviews/:id` - Xóa đánh giá

#### Contacts
- `GET /api/admin/contacts` - Danh sách liên hệ admin
- `GET /api/admin/contacts/:id` - Chi tiết liên hệ
- `PUT /api/admin/contacts/:id/status` - Cập nhật trạng thái liên hệ
- `DELETE /api/admin/contacts/:id` - Xóa liên hệ

#### Users
- `GET /api/admin/users` - Danh sách users admin
- `POST /api/admin/users` - Tạo user
- `PUT /api/admin/users/:id` - Cập nhật user
- `DELETE /api/admin/users/:id` - Xóa user

#### Settings
- `GET /api/admin/settings` - Lấy cài đặt
- `PUT /api/admin/settings` - Cập nhật cài đặt

## 🔒 Authentication

API sử dụng JWT để xác thực. Gửi token trong header:

```javascript
Authorization: Bearer <your-jwt-token>
```

Hoặc sử dụng cookies (được cấu hình tự động).

## 📝 Response Format

Tất cả API responses đều có format chuẩn:

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

## 🧪 Testing

```bash
# Chạy tests
npm test

# Chạy tests với watch mode
npm run test:watch
```

## 📦 Build

```bash
# Build cho production
npm run build

# Clean build directory
npm run clean
```

## 🚀 Deployment

### Docker
```bash
# Build Docker image
docker build -t hugox-backend .

# Run container
docker run -p 3000:3000 hugox-backend
```

### PM2
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start dist/index.js --name hugox-backend

# Save PM2 configuration
pm2 save
pm2 startup
```

## 📁 Cấu trúc thư mục

```
src/
├── config/          # Cấu hình database, app
├── controllers/     # Controllers xử lý logic
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

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Support

- Email: support@hugox.com
- Documentation: [API Docs](http://localhost:3000/api-docs)
- Issues: [GitHub Issues](https://github.com/hugox/backend/issues)

## 🔄 Changelog

### v1.0.0
- Initial release
- Basic CRUD operations
- Authentication system
- Admin panel APIs
- Client APIs
- File upload support
- Rate limiting
- Security middleware
