

USE bookstore;
-- =============================================
-- BẢNG TÁC GIẢ
-- =============================================
CREATE TABLE tacgia (
  MaTG INT AUTO_INCREMENT PRIMARY KEY,
  TenTG VARCHAR(100) NOT NULL,
  NamSinh INT,
  QueQuan VARCHAR(100),
  NamMat INT
);

-- =============================================
-- BẢNG NHÀ XUẤT BẢN
-- =============================================
CREATE TABLE nhaxuatban (
  MaNXB INT AUTO_INCREMENT PRIMARY KEY,
  TenNXB VARCHAR(100) NOT NULL,
  NamThanhLap INT
);

-- =============================================
-- BẢNG LOẠI SÁCH
-- =============================================
CREATE TABLE loaisach (
  MaLoaiSach INT AUTO_INCREMENT PRIMARY KEY,
  TenLoaiSach VARCHAR(100)
);

-- =============================================
-- BẢNG SÁCH (đã loại bỏ MaLinhVuc)
-- =============================================
CREATE TABLE sach (
  MaSach INT AUTO_INCREMENT PRIMARY KEY,
  TenSach VARCHAR(200) NOT NULL,
  AnhBia VARCHAR(255),
  LanTaiBan INT,
  GiaBan DECIMAL(10,2),
  NamXuatBan INT,
  MaTG INT NOT NULL,
  MaNXB INT NOT NULL,
  MaLoaiSach INT,
  FOREIGN KEY (MaTG) REFERENCES tacgia(MaTG),
  FOREIGN KEY (MaNXB) REFERENCES nhaxuatban(MaNXB),
  FOREIGN KEY (MaLoaiSach) REFERENCES loaisach(MaLoaiSach)
);

-- =============================================
-- BẢNG KHO
-- =============================================

-- =============================================
-- BẢNG TÀI KHOẢN
-- =============================================
CREATE TABLE user(
  Username VARCHAR(50) PRIMARY KEY,
  PassWord VARCHAR(100) NOT NULL,
  VaiTro VARCHAR(20)
);
-- =============================================
-- BẢNG KHÁCH HÀNG
-- =============================================
CREATE TABLE khachhang (
  MaKH INT AUTO_INCREMENT PRIMARY KEY,
  Username VARCHAR(50) UNIQUE,
  HoTen VARCHAR(100),
  DiaChi VARCHAR(255),
  SDienThoai VARCHAR(15),
  Email VARCHAR(100),
  FOREIGN KEY (Username) REFERENCES user(Username)
);

-- =============================================
-- BẢNG TÀI KHOẢN
-- =============================================
CREATE TABLE user(
  Username VARCHAR(50) PRIMARY KEY,
  PassWord VARCHAR(100) NOT NULL,
  VaiTro VARCHAR(20)
);

-- =============================================
-- BẢNG GIỎ HÀNG
-- =============================================
CREATE TABLE giohang (
  MaGioHang INT AUTO_INCREMENT PRIMARY KEY,
  MaKH INT,
  NgayTao DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (MaKH) REFERENCES khachhang(MaKH)
);

-- =============================================
-- BẢNG CHI TIẾT GIỎ HÀNG
-- =============================================
CREATE TABLE chitietgiohang (
  MaGioHang INT,
  MaSach INT,
  SoLuong INT,
  PRIMARY KEY (MaGioHang, MaSach),
  FOREIGN KEY (MaGioHang) REFERENCES giohang(MaGioHang),
  FOREIGN KEY (MaSach) REFERENCES sach(MaSach)
);

-- =============================================
-- BẢNG HÓA ĐƠN
-- =============================================
CREATE TABLE hoadon (
  MaHoaDon INT AUTO_INCREMENT PRIMARY KEY,
  MaKH INT,
  NgayLap DATETIME DEFAULT CURRENT_TIMESTAMP,
  TongTien DECIMAL(12,2),
  TrangThai VARCHAR(50),
  FOREIGN KEY (MaKH) REFERENCES khachhang(MaKH)
);

-- =============================================
-- BẢNG CHI TIẾT HÓA ĐƠN
-- =============================================
CREATE TABLE chitiethoadon (
  MaHoaDon INT,
  MaSach INT,
  SoLuong INT,
  DonGia DECIMAL(10,2),
  PRIMARY KEY (MaHoaDon, MaSach),
  FOREIGN KEY (MaHoaDon) REFERENCES hoadon(MaHoaDon),
  FOREIGN KEY (MaSach) REFERENCES sach(MaSach)
);
CREATE TABLE danhmuc (
  MaDanhMuc INT AUTO_INCREMENT PRIMARY KEY,
  TenDanhMuc VARCHAR(100) NOT NULL,
  ParentID INT DEFAULT NULL,
  FOREIGN KEY (ParentID) REFERENCES danhmuc(MaDanhMuc)
);
ALTER TABLE sach ADD COLUMN MaDanhMuc INT,
ADD FOREIGN KEY (MaDanhMuc) REFERENCES danhmuc(MaDanhMuc);

ALTER TABLE nhaxuatban
ADD COLUMN DiaChi varchar(100);

-- Thêm cột Mô Tả và Số Lượng Tồn nếu chưa có
ALTER TABLE sach
ADD COLUMN MoTa TEXT NULL,
ADD COLUMN SoLuongTon INT DEFAULT 0;

CREATE TABLE donhang (
  MaDH INT AUTO_INCREMENT PRIMARY KEY,
  MaKH INT NOT NULL,  
  NgayDat DATETIME DEFAULT CURRENT_TIMESTAMP, 
  TongTien DECIMAL(12,2) NOT NULL,
  PhiVanChuyen DECIMAL(10,2) DEFAULT 0.00,
  DiaChiGiaoHang VARCHAR(255),
  GhiChuGiaoHang TEXT, 
  TrangThai VARCHAR(50) NOT NULL,
  FOREIGN KEY (MaKH) REFERENCES khachhang(MaKH)
);
CREATE TABLE chitietdonhang (
  MaDH INT,
  MaSach INT,
  SoLuong INT NOT NULL, -- SL: 1
  DonGia DECIMAL(10,2) NOT NULL, 
  PRIMARY KEY (MaDH, MaSach),
  FOREIGN KEY (MaDH) REFERENCES donhang(MaDH),
  FOREIGN KEY (MaSach) REFERENCES sach(MaSach)
);
CREATE TABLE binhluan (
  MaBL INT AUTO_INCREMENT PRIMARY KEY,
  MaKH INT,
  MaSach INT,
  NoiDung TEXT,
  NgayBinhLuan DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (MaKH) REFERENCES khachhang(MaKH),
  FOREIGN KEY (MaSach) REFERENCES sach(MaSach)
);
ALTER TABLE binhluan 
ADD COLUMN TrangThai VARCHAR(20) DEFAULT 'pending'; 
-- (Tùy chọn) Cập nhật tất cả bình luận cũ thành "đã duyệt" để nó hiện lên web luôn
UPDATE binhluan SET TrangThai = 'approved';
UPDATE binhluan SET TrangThai = 'approved' WHERE MaBL > 0;
-- 1. Thêm cột TrangThai
ALTER TABLE binhluan ADD COLUMN TrangThai VARCHAR(20) DEFAULT 'pending';

-- 2. Tắt chế độ an toàn tạm thời để update được
SET SQL_SAFE_UPDATES = 0;

-- 3. Update tất cả bình luận cũ thành "Đã duyệt" (approved)
UPDATE binhluan SET TrangThai = 'approved';

-- 4. Bật lại chế độ an toàn
SET SQL_SAFE_UPDATES = 1;