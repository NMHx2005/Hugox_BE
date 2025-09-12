# 📋 **HƯỚNG DẪN SỬ DỤNG POSTMAN COLLECTION**

## 🚀 **CÁCH IMPORT VÀO POSTMAN**

### **1. Import Collection**
1. Mở Postman
2. Click **Import** button
3. Chọn file `HUGOX_API_Collection.postman_collection.json`
4. Click **Import**

### **2. Import Environment**
1. Click **Import** button
2. Chọn file `HUGOX_Environment.postman_environment.json`
3. Click **Import**
4. Chọn environment **HugoX Development**

## 🔧 **CÁCH SỬ DỤNG**

### **1. Khởi động Server**
```bash
cd backend_03_09_2025
npm run dev
```

### **2. Test Health Check**
- **GET** `http://localhost:3000/health`
- Kết quả mong đợi: `{"success": true, "message": "Server is running"}`

### **3. Test Authentication**
1. **User Register** → Lấy response
2. **User Login** → Copy `token` từ response vào environment variable `token`
3. **Get User Profile** → Test với token

### **4. Test Admin APIs**
1. **Admin Login** → Copy `token` từ response vào environment variable `adminToken`
2. Test các admin APIs với `adminToken`

### **5. Test Product APIs**
1. **Get All Products** → Lấy `_id` của product đầu tiên
2. Copy `_id` vào environment variable `productId`
3. Test các product APIs khác

### **6. Test Upload APIs**
1. Chọn file image từ máy tính
2. **Upload Product Image** → Test upload
3. Copy `public_id` từ response để test delete

## 📊 **CÁC API CHÍNH CẦN TEST**

### **🔐 Authentication (5 APIs)**
- ✅ User Login/Register/Logout
- ✅ Get/Update Profile

### **🛍️ Products (5 APIs)**
- ✅ Get All Products
- ✅ Get Product by ID
- ✅ Get Featured Products
- ✅ Get Related Products
- ✅ Search Products

### **📂 Categories (3 APIs)**
- ✅ Get All Categories
- ✅ Get Category by ID
- ✅ Get Products by Category

### **📰 News (4 APIs)**
- ✅ Get All News
- ✅ Get News by ID
- ✅ Get News Categories
- ✅ Get Featured News

### **⭐ Reviews (6 APIs)**
- ✅ Get All Reviews
- ✅ Get Review by ID
- ✅ Get Product Reviews
- ✅ Create Review
- ✅ Like/Dislike Review

### **📞 Contact (2 APIs)**
- ✅ Send Contact Form
- ✅ Register as Agent

### **🔍 Search & Filter (7 APIs)**
- ✅ Global Search
- ✅ Search Products/News
- ✅ Get Filter Categories
- ✅ Get Price Ranges
- ✅ Get Brands/Tags

### **📱 Mobile (3 APIs)**
- ✅ Get Bottom Bar Config
- ✅ Get Hero Banner Config
- ✅ Get Featured Sections

### **🔧 Admin APIs (25+ APIs)**
- ✅ Admin Authentication
- ✅ User Management
- ✅ Product Management
- ✅ Dashboard Analytics
- ✅ Settings Management
- ✅ Upload Management

## 🎯 **TESTING CHECKLIST**

### **Phase 1: Basic APIs**
- [ ] Health Check
- [ ] User Authentication
- [ ] Product CRUD
- [ ] Category CRUD
- [ ] News CRUD

### **Phase 2: Advanced APIs**
- [ ] Review System
- [ ] Search & Filter
- [ ] Contact System
- [ ] Upload System

### **Phase 3: Admin APIs**
- [ ] Admin Authentication
- [ ] Admin Dashboard
- [ ] Admin Settings
- [ ] Admin Management

## 🚨 **LƯU Ý QUAN TRỌNG**

1. **Environment Variables**: Luôn cập nhật `token` và `adminToken` sau khi login
2. **File Upload**: Chọn file thực tế từ máy tính khi test upload
3. **Error Handling**: Kiểm tra response status và error messages
4. **Pagination**: Test với các tham số `page` và `limit` khác nhau
5. **Search**: Test với các từ khóa tìm kiếm khác nhau

## 📈 **KẾT QUẢ MONG ĐỢI**

- **Status Code**: 200, 201, 400, 401, 404, 500
- **Response Format**: 
  ```json
  {
    "success": true,
    "message": "Success message",
    "data": { ... }
  }
  ```
- **Error Format**:
  ```json
  {
    "success": false,
    "message": "Error message",
    "error": "Error details"
  }
  ```

## 🎉 **HOÀN THÀNH**

Sau khi test xong tất cả APIs, bạn sẽ có:
- ✅ 50+ APIs hoạt động hoàn hảo
- ✅ Authentication & Authorization
- ✅ CRUD operations đầy đủ
- ✅ Search & Filter nâng cao
- ✅ Admin Dashboard
- ✅ File Upload với Cloudinary
- ✅ Mobile Support

**Chúc bạn test thành công!** 🚀
