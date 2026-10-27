# Hướng dẫn quản lý web Anela Pastry

Web gồm 6 trang: Trang chủ (`index.html`), BST mẫu bánh, Tìm mẫu (tất cả mẫu bánh), Đơn hàng của tôi, Mua hàng, Đánh giá.
**Mọi nội dung (mẫu bánh, giá, thông tin tiệm) nằm trong 1 file: `js/data.js`.** Bạn không cần sửa các file khác.

## 1. Xem thử web trên máy
Mở thư mục `D:\cake` rồi bấm đúp vào `index.html` – web mở bằng trình duyệt.

## 2. Thêm ảnh bánh từ Facebook / Instagram
Instagram và Facebook không cho web khác dùng trực tiếp đường link ảnh (link sẽ hết hạn), nên cần lưu ảnh về:

1. Mở bài đăng trên Facebook/Instagram của shop → lưu ảnh về máy (hoặc lấy ảnh gốc trong điện thoại – nét hơn).
2. Đổi tên file **không dấu, không khoảng trắng**, ví dụ `mousse-dau-tay.jpg`.
3. Chép vào thư mục `images/cakes/`.
4. Trong `js/data.js`, dòng `image:` của mẫu đó phải trùng tên file: `image: "images/cakes/mousse-dau-tay.jpg"`.

Mẹo: ảnh dọc tỉ lệ 4:5 (giống ảnh Instagram) hiển thị đẹp nhất; nén ảnh còn ~200–400KB (dùng tinypng.com) để web tải nhanh.
Ảnh mẫu bánh nằm trong `images/cakes/`. Mẫu nào có thêm ảnh phụ thì ghi `gallery: ["images/cakes/ten-anh.jpg"]` trong phần `products` – khách bấm vào mẫu sẽ thấy ảnh nhỏ để chuyển qua lại. Ảnh nền trang chủ: `images/hero.jpg` (điện thoại) và `images/hero-ngang.jpg` (máy tính).
Chưa có ảnh thì web tự hiện khung màu kèm tên bánh.

## 3. Sửa giá, thêm / xoá mẫu bánh
Mở `js/data.js` bằng Notepad hoặc VS Code.

**Giá đang được ẩn** (`showPrices: false`): khách vẫn chọn mẫu, size và đặt bánh, web ghi "Giá: liên hệ" và Anela báo giá khi xác nhận đơn.
Giá đang ghi trong file là giá mẫu. Khi muốn hiện giá: sửa lại toàn bộ `price` theo giá thật, rồi đổi thành `showPrices: true`.

Thêm mẫu mới: sao chép một khối `{ ... },` trong `products` rồi sửa:

```js
{
  id: "mousse-dao",                 // mã riêng, không dấu, không trùng
  category: "mousse",               // mousse | napoleon | chiffon | cheesecake | wedding | hamper
  name: "Mousse đào",
  image: "images/cakes/mousse-dao.jpg",
  description: "Mô tả ngắn về bánh.",
  tags: ["đào", "trái cây", "sinh nhật"],   // dùng cho trang Tìm mẫu
  isNew: true,                      // hiện nhãn "Mới" + lên mục Mẫu bánh mới
  bestSeller: false,                // hiện ở mục Mẫu bán chạy
  sizes: [
    { label: "14cm · 2–4 người", price: 290000 },
    { label: "16cm · 4–6 người", price: 360000 }
  ]
},
```

Cũng trong file này: hotline, giờ mở cửa, địa chỉ tiệm (`address`, `mapUrl`), thông tin chuyển khoản (`bank`), khung giờ giao.
Giá bánh sửa ở `price` của từng mẫu (đơn vị đồng). Phí ship (`shipping`: miễn phí dưới 15km, trên 15km thu 30.000đ, tính theo khoảng cách đường thẳng từ tiệm tới phường/xã khách chọn; danh sách phường/xã và toạ độ ở `js/phuong-hanoi.js`) và tiền cọc (`depositRate: 0.5` = cọc 50% tiền bánh) cũng nằm trong `js/data.js`.

Đánh giá thật từ Facebook có thể chép vào `reviews` theo mẫu ghi trong file.

## 3b. Thêm bộ sưu tập (BST) mới
Trang chủ hiện ảnh bìa và caption của từng BST; bấm vào sẽ mở trang riêng của BST với đủ các mẫu bánh.

1. Chép ảnh bìa BST vào `images/bst/` (VD `giang-sinh.jpg`), ảnh từng chiếc bánh vào `images/cakes/`.
2. Trong `js/data.js`, thêm một khối vào `collections` (BST mới nhất đặt lên đầu):

```js
{ id: "giang-sinh", name: "Giáng Sinh", subtitle: "BST Noel 2026", image: "images/bst/giang-sinh.jpg",
  caption: "Đoạn giới thiệu BST…",
  points: ["Ý 1…", "Ý 2…"],   // không cần thì xoá dòng này
  outro: "Câu kết…" },          // không cần thì xoá dòng này
```

3. Thêm từng mẫu bánh của BST vào `products`, ghi `collection: "giang-sinh"` (và `isNew: true` nếu muốn hiện ở mục Mẫu mới ra lò).

## 4. Đơn hàng được gửi tới shop thế nào?
Web là web tĩnh (không có máy chủ riêng), nên khi khách bấm **Đặt bánh**:
- Đơn được tạo mã (VD `AN1A2B3C`), lưu trên điện thoại/máy của khách (xem lại ở **Đơn hàng của tôi**).
- Nội dung đơn tự sao chép, khách bấm **Gửi qua Zalo / Messenger** và dán vào tin nhắn cho shop.

**Tự động ghi đơn vào Google Sheets (khuyên dùng, miễn phí):**
1. Tạo một Google Sheets mới → menu **Tiện ích mở rộng → Apps Script**.
2. Xoá code có sẵn, dán toàn bộ nội dung file `google-apps-script.gs` → Lưu.
3. Bấm **Triển khai → Tùy chọn triển khai mới** → loại **Ứng dụng web**; "Thực thi với tư cách": *Tôi*; "Người có quyền truy cập": *Bất kỳ ai* → Triển khai, cấp quyền.
4. Sao chép **URL ứng dụng web** và dán vào `orderWebhook: "..."` trong `js/data.js`.

Từ đó mọi đơn hàng và đánh giá mới sẽ tự thêm vào sheet `DonHang` và `DanhGia`.

Lưu ý: đánh giá khách viết trên web chỉ hiện trên máy của chính khách đó; muốn hiện công khai cho mọi người, hãy chép đánh giá (từ Sheets) vào phần `reviews` trong `js/data.js`.

## 5. Đưa web lên mạng (miễn phí)
- **Netlify**: vào app.netlify.com/drop → kéo thả cả thư mục `cake` → có link ngay. Mỗi lần sửa, kéo thả lại.
- Hoặc **GitHub Pages / Vercel**.
- Muốn tên miền riêng (VD `anelapastry.vn`): mua tên miền rồi gắn vào Netlify trong mục Domain settings.
