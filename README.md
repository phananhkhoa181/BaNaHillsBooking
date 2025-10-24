# Sunworld Ba Na Hills - Ticket Booking System

🎫 **Hệ thống đặt vé cáp treo trực tuyến cho Sunworld Bà Nà Hills**

## 📋 Giới thiệu

Đây là một ứng dụng web được xây dựng theo kiến trúc MVC (Model-View-Controller) cho phép khách hàng đặt vé cáp treo và lấy số thứ tự trực tuyến tại khu du lịch Sunworld Bà Nà Hills, Đà Nẵng.

### ✨ Tính năng chính

- 🎟️ **Đặt vé trực tuyến**: Hệ thống lấy số thứ tự tự động cho hai tuyến cáp treo
  - Chiều đi: Ga Suối Mơ → Đỉnh Bà Nà
  - Chiều về: Đỉnh Bà Nà → Ga Suối Mơ
- 📱 **Thiết kế Responsive**: Tương thích hoàn hảo trên mọi thiết bị (Desktop, Tablet, Mobile)
- 🎨 **UI/UX Hiện đại**: Giao diện đẹp mắt, thân thiện với người dùng
- 🏞️ **Giới thiệu điểm đến**: Showcase các điểm vui chơi nổi bật tại Bà Nà Hills
- 💾 **Lưu trữ Local**: Dữ liệu booking được lưu trữ trong localStorage
- ✅ **Xác thực Form**: Kiểm tra dữ liệu đầu vào chặt chẽ
- 🎭 **Hiệu ứng mượt mà**: Animations và transitions chuyên nghiệp

## 🏗️ Kiến trúc MVC

```
projectout/
├── models/              # Data Models
│   ├── Ticket.js       # Ticket model - quản lý thông tin vé
│   └── Booking.js      # Booking model - quản lý đặt vé
├── views/              # Views (HTML)
│   └── index.html      # Main view
├── controllers/        # Controllers
│   └── BookingController.js  # Xử lý logic đặt vé
├── assets/            # Static assets
│   ├── css/
│   │   ├── style.css         # Main styles
│   │   └── responsive.css    # Responsive styles
│   ├── js/
│   │   └── main.js          # UI interactions
│   └── images/              # Image assets
└── index.html         # Entry point
```

### 📦 Components

#### Models (models/)
- **Ticket.js**: Định nghĩa cấu trúc dữ liệu vé, tạo số thứ tự
- **Booking.js**: Quản lý tất cả bookings, lưu trữ vào localStorage

#### Controllers (controllers/)
- **BookingController.js**: Xử lý logic đặt vé, validation, và hiển thị modal

#### Views (index.html)
- Hero section với call-to-action
- Booking cards cho hai tuyến cáp treo
- Attractions showcase
- Contact form
- Booking & Success modals

#### Assets
- **CSS**: Styling hiện đại với variables, animations
- **JavaScript**: UI interactions, smooth scrolling, animations

## 🚀 Cài đặt và Chạy

### Yêu cầu
- Trình duyệt web hiện đại (Chrome, Firefox, Safari, Edge)
- Không cần cài đặt Node.js hay framework phức tạp

### Cách 1: Mở trực tiếp
1. Mở file `index.html` trong trình duyệt:
   ```bash
   # Windows
   start index.html
   
   # Mac
   open index.html
   
   # Linux
   xdg-open index.html
   ```

### Cách 2: Sử dụng Live Server (Khuyến nghị)

#### VS Code Extension
1. Cài đặt extension "Live Server" trong VS Code
2. Right-click vào `index.html`
3. Chọn "Open with Live Server"
4. Website sẽ mở tại `http://localhost:5500`

#### Python HTTP Server
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```
Truy cập: `http://localhost:8000`

#### Node.js http-server
```bash
# Cài đặt
npm install -g http-server

# Chạy
http-server -p 8000
```
Truy cập: `http://localhost:8000`

## 📖 Hướng dẫn sử dụng

### Cho người dùng

1. **Chọn tuyến cáp treo**: 
   - Scroll xuống phần "Lấy Số Thứ Tự"
   - Chọn chiều đi hoặc chiều về
   - Click nút "Lấy số thứ tự"

2. **Điền thông tin**:
   - Họ và tên (bắt buộc)
   - Số điện thoại (bắt buộc)
   - Email (tùy chọn)
   - Số lượng vé (1-8 người)
   - Ngày đến (bắt buộc)
   - Ghi chú (tùy chọn)

3. **Xác nhận**:
   - Click "Xác nhận đặt vé"
   - Nhận số thứ tự duy nhất
   - Lưu hoặc chụp màn hình số thứ tự

4. **Đến quầy**:
   - Mang số thứ tự đến quầy trước 15 phút
   - Xuất trình để nhận vé

### Cho Developer

#### Thêm tính năng mới
```javascript
// Trong BookingController.js
handleBookingSubmit(e) {
    // Thêm logic xử lý tại đây
}
```

#### Tùy chỉnh giao diện
```css
/* Trong assets/css/style.css */
:root {
    --primary-color: #ff6b35;  /* Đổi màu chủ đạo */
    --secondary-color: #f7931e;
}
```

#### Thêm validation
```javascript
// Trong BookingController.js
validateBookingData(data) {
    // Thêm validation rules
}
```

## 🎨 Thay thế hình ảnh

Hiện tại dự án sử dụng placeholder images. Để thay thế:

1. Chuẩn bị hình ảnh theo hướng dẫn trong `assets/images/README.md`
2. Đặt tên file theo đúng quy ước:
   - `hero-placeholder.jpg`
   - `cable-car-placeholder.jpg`
   - `cable-car-return-placeholder.jpg`
   - `museum-placeholder.jpg`
   - `golden-bridge-placeholder.jpg`
   - `french-village-placeholder.jpg`
   - `dragon-statue-placeholder.jpg`
   - `sun-wheel-placeholder.jpg`
   - `flower-garden-placeholder.jpg`
   - `about-placeholder.jpg`
3. Copy vào thư mục `assets/images/`
4. Refresh trình duyệt

## 🔧 Tùy chỉnh

### Thay đổi thông tin liên hệ
Mở `index.html` và tìm section `#contact`:
```html
<p>(+84) 905 766 777</p>
<p>banahills@sunworld.vn</p>
```

### Thêm điểm tham quan
Trong `index.html`, section `#attractions`, thêm:
```html
<div class="attraction-card">
    <div class="attraction-image">
        <img src="assets/images/your-image.jpg" alt="...">
        <div class="attraction-overlay">
            <button class="btn-explore">Khám phá</button>
        </div>
    </div>
    <div class="attraction-info">
        <h3>Tên điểm tham quan</h3>
        <p>Mô tả...</p>
    </div>
</div>
```

### Thay đổi số lượng vé tối đa
Trong `index.html`, tìm `#numberOfTickets`:
```html
<select id="numberOfTickets" name="numberOfTickets" required>
    <option value="1">1 người</option>
    <!-- Thêm options mới -->
    <option value="10">10 người</option>
</select>
```

## 🌐 Tính năng nâng cao (Tùy chọn)

### Backend Integration
Để kết nối với backend, sửa `BookingController.js`:

```javascript
async handleBookingSubmit(e) {
    e.preventDefault();
    const formData = this.getFormData();
    
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        
        const ticket = await response.json();
        this.showSuccessModal(ticket);
    } catch (error) {
        this.showError('Có lỗi xảy ra');
    }
}
```

### Email Confirmation
Thêm service gửi email xác nhận:
```javascript
async sendConfirmationEmail(ticket) {
    await fetch('/api/send-confirmation', {
        method: 'POST',
        body: JSON.stringify({ ticket })
    });
}
```

### Payment Integration
Tích hợp cổng thanh toán như VNPay, MoMo, ZaloPay

## 📱 Responsive Breakpoints

- **Desktop**: > 968px
- **Tablet**: 768px - 968px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## ⚡ Performance

- Lazy loading images
- Optimized CSS with variables
- Minimal JavaScript dependencies
- LocalStorage for data persistence
- Smooth animations with CSS transitions

## 🔒 Bảo mật

- Client-side validation
- XSS protection (sanitize inputs)
- No sensitive data in localStorage
- HTTPS recommended for production

## 📞 Hỗ trợ

- **Email**: banahills@sunworld.vn
- **Điện thoại**: (+84) 905 766 777
- **Địa chỉ**: Đà Nẵng, Việt Nam

## 📝 License

© 2025 Sunworld Ba Na Hills. All rights reserved.

## 🤝 Đóng góp

Nếu bạn muốn đóng góp cho dự án:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Mở Pull Request

## 🎯 Roadmap

- [ ] Tích hợp backend API
- [ ] Thêm tính năng thanh toán online
- [ ] Gửi email xác nhận tự động
- [ ] Quản lý admin dashboard
- [ ] Multi-language support (English)
- [ ] PWA (Progressive Web App)
- [ ] QR Code cho vé
- [ ] Real-time queue status
- [ ] Push notifications
- [ ] Analytics dashboard

## 👨‍💻 Developer

Developed with ❤️ using vanilla JavaScript, HTML5, and CSS3

---

**Happy Coding! 🚀**
