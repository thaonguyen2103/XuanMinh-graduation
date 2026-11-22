# Website Mời Tốt Nghiệp (Next.js + TypeScript)

Dự án thiệp mời tốt nghiệp được xây dựng bằng **Next.js 14 (App Router)** và **TypeScript**, hoạt động độc lập không cần backend bên ngoài.

---

## 🚀 Cách Chạy Dự Án

### 1. Di chuyển vào thư mục dự án
Mở terminal (PowerShell hoặc Command Prompt) và chạy:
```bash
cd "graduation-invite"
```

### 2. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
Sau đó mở trình duyệt và truy cập:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🔗 Các Đường Link Mẫu Để Thử Nghiệm

Mỗi khách mời có một link riêng dạng `http://localhost:3000/[guest-id]`:

| Loại khách | Link truy cập | Mô tả | Ảnh sử dụng |
|---|---|---|---|
| **VIP** | [http://localhost:3000/vip-01](http://localhost:3000/vip-01) | GS. TS. Nguyễn Văn A (chưa xác nhận) | `/images/vip-01.png` |
| **VIP** | [http://localhost:3000/vip-02](http://localhost:3000/vip-02) | Chị Hoàng Lan (đã xác nhận) | `/images/vip-02.png` |
| **Normal** | [http://localhost:3000/guest-01](http://localhost:3000/guest-01) | Nguyễn Hoàng Nam | `/images/1.jpg` (ảnh 1) |
| **Normal** | [http://localhost:3000/guest-02](http://localhost:3000/guest-02) | Trần Thị Mai | `/images/1.jpg` (ảnh 1) |
| **Normal** | [http://localhost:3000/guest-xminh](http://localhost:3000/guest-xminh) | Bạn Thân Của Minh | `/images/1.jpg` (ảnh 1) |

> ⚠️ **Kiểm tra sửa URL:**
> - Nếu truy cập `http://localhost:3000/` hoặc nhập link không có trong danh sách (vd: `http://localhost:3000/sai-link`), hệ thống sẽ hiển thị màn hình cảnh báo không cho phép chỉnh sửa URL và từ chối truy cập.

---

## 📁 Cấu Trúc Dữ Liệu JSON

Dữ liệu lưu tại file: `src/data/invitation.json`

```json
{
  "host": {
    "name": "XMINH",
    "time": "2026-12-20T18:00:00+07:00",
    "timeNote": "Cửa mở từ 17:30",
    "placeName": "Trường ĐH Khoa học Tự nhiên - ĐHQG-HCM",
    "address": "227 Nguyễn Văn Cừ, Phường 4, Quận 5, TP.HCM",
    "mapUrl": "https://maps.google.com/?q=227+Nguyễn+Văn+Cừ+Quận+5+TPHCM",
    "closing": "Thân mến,",
    "defaultMessage": "Cảm ơn {name} đã đồng hành cùng mình suốt thời gian qua. Mình rất mong được gặp bạn trong ngày đặc biệt này."
  },
  "guests": [
    {
      "id": "vip-01",
      "name": "GS. TS. Nguyễn Văn A",
      "type": "vip",
      "confirmation": false,
      "message": "Em kính mời Thầy đến tham dự buổi lễ tốt nghiệp của em. Sự hiện diện của Thầy là niềm vinh dự lớn nhất của em!"
    },
    {
      "id": "guest-01",
      "name": "Nguyễn Hoàng Nam",
      "type": "normal",
      "confirmation": false
    }
  ]
}
```

### Cách thức hoạt động:
1. **Chủ nhân (`host`)**: Cấu hình họ tên, thời gian diễn ra buổi lễ, địa điểm, bản đồ, chữ ký.
2. **Khách mời (`guests`)**:
   - `id`: Mã định danh định tuyến URL (`/guest-id`).
   - `name`: Tên khách mời hiển thị trên vé và thiệp.
   - `type`: 
     - `"normal"`: Tự động dùng ảnh 1 (`/public/images/1.jpg`).
     - `"vip"`: Tự động dùng ảnh riêng đặt theo ID (`/public/images/[id].png`).
   - `confirmation`: `true` hoặc `false`.
3. **Xác nhận tham dự**:
   - Khi khách bấm nút **"Mình sẽ đến!"**, hệ thống gọi API nội bộ Next.js `/api/rsvp` để cập nhật `confirmation: true` trực tiếp vào file `invitation.json` trên đĩa.
   - Nút đổi thành **"Đã xác nhận ✓"**, đóng dấu mộc và kích hoạt hiệu ứng pháo giấy confetti.

---

## 🛠️ Build Sản Phẩm (Production)

```bash
npm run build
npm start
```
