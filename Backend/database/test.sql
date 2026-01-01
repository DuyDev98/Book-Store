USE bookstore;

-- Tắt kiểm tra khóa ngoại tạm thời để nạp dữ liệu nhanh hơn
SET FOREIGN_KEY_CHECKS = 0;

-- ==========================================================
-- 1. XÓA DỮ LIỆU CŨ (Làm sạch kho)
-- ==========================================================
TRUNCATE TABLE chitietgiohang;
TRUNCATE TABLE chitietdonhang;
TRUNCATE TABLE chitiethoadon;
TRUNCATE TABLE binhluan;
TRUNCATE TABLE giohang;
TRUNCATE TABLE donhang;
TRUNCATE TABLE hoadon;
TRUNCATE TABLE sach;
TRUNCATE TABLE tacgia;
TRUNCATE TABLE nhaxuatban;
TRUNCATE TABLE danhmuc;
TRUNCATE TABLE user;
TRUNCATE TABLE khachhang;



-- ==========================================================
-- 3. NẠP DỮ LIỆU NHÀ XUẤT BẢN (Từ file nhaxuatban.docx) [cite: 1, 2]
-- ==========================================================
INSERT INTO nhaxuatban (MaNXB, TenNXB, NamThanhLap, DiaChi) VALUES
(1, 'NXB Thế Giới', 1957, '59 Thợ Nhuộm, Cửa Nam, Hoàn Kiếm, Hà Nội'),
(2, 'NXB Công Thương', 1960, 'Tầng 4, 655 Phạm Văn Đồng, Bắc Từ Liêm, Hà Nội'),
(3, 'NXB Dân Trí', 2005, '9 ngõ 26 Hoàng Cầu, Đống Đa, Hà Nội'),
(4, 'NXB Tài Chính', 1961, 'Số 34 Hàng Chuối, Hai Bà Trưng, Hà Nội'),
(5, 'NXB Lao Động', 1957, '175 Giảng Võ, Ô Chợ Dừa, Hà Nội'),
(6, 'NXB Hà Nội', 1956, '4 Tống Duy Tân, Hoàn Kiếm, Hà Nội'),
(7, 'NXB Hồng Đức', 2007, '65 Tràng Thi, Hoàn Kiếm, Hà Nội'),
(8, 'NXB Thanh Niên', 1989, '62 Bà Triệu, Hoàn Kiếm, Hà Nội'),
(9, 'NXB Thanh Hóa', 1986, '04 Cao Thắng, TP. Thanh Hóa, Thanh Hóa'),
(10, 'NXB Mỹ Thuật', 1957, '51 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội'),
(11, 'NXB Hội Nhà Văn', 1957, '65 Nguyễn Du, Hai Bà Trưng, Hà Nội'),
(12, 'NXB Văn Học', 1957, '18 Nguyễn Trường Tộ, Ba Đình, Hà Nội'),
(13, 'NXB Phụ Nữ', 1948, '16 Alexander de Rhodes, Quận 1, TP. Hồ Chí Minh'),
(14, 'NXB Trẻ', 1981, '161B Lý Chính Thắng, Quận 3, TP. Hồ Chí Minh'),
(15, 'NXB Giáo Dục', 1957, '81 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội'),
(16, 'NXB Chính Trị Quốc Gia Sự Thật', 1945, '6/86 Duy Tân, Cầu Giấy, Hà Nội');

-- ==========================================================
-- 4. NẠP DỮ LIỆU TÁC GIẢ (Từ file them_tac_gia.doc) [cite: 3, 4]
-- ==========================================================
-- Lưu ý: Mình set ID cứng để dễ map với sách sau này
INSERT INTO tacgia (MaTG, TenTG, NamSinh, NamMat, QueQuan) VALUES
(1, 'Đỗ Quốc Dũng', NULL, NULL, 'Việt Nam'),
(2, 'Leader Thanh', NULL, NULL, 'Việt Nam'),
(3, 'Andrea Fryrear', 1983, NULL, 'Hoa Kỳ'),
(4, 'Joe Vitale', 1953, NULL, 'Hoa Kỳ'),
(5, 'Matt Johnson PhD, Prince Ghuman', NULL, NULL, 'Hoa Kỳ'),
(6, 'Richard Moore', NULL, NULL, 'Hoa Kỳ'),
(7, 'Jeb Blount, Anthony Iannarino', NULL, NULL, 'Hoa Kỳ'),
(8, 'Nhiều tác giả', NULL, NULL, 'Không rõ'),
(9, 'Aaron Ross, Marylou Tyler', NULL, NULL, 'Hoa Kỳ'),
(10, 'Dan S Kennedy', 1954, NULL, 'Hoa Kỳ'),
(11, 'Joseph F. Hair, Jr.', NULL, NULL, 'Hoa Kỳ'),
(12, 'David Borman', NULL, NULL, 'Hoa Kỳ'),
(13, 'Alfred Mill', NULL, NULL, 'Không rõ'),
(14, 'Chris Guillebeau', 1978, NULL, 'Hoa Kỳ'),
(15, 'Tào Thị Thủy Tiên', NULL, NULL, 'Việt Nam'), -- Bổ sung từ file sách
(16, 'Dawn Fotopulos', NULL, NULL, 'Hoa Kỳ'),
(17, 'Karthik Ramanna', 1977, NULL, 'Ấn Độ'),
(18, 'Ryoichi Kakui', NULL, NULL, 'Nhật Bản'),
(19, 'Russ Laraway', NULL, NULL, 'Hoa Kỳ'),
(20, 'Raymond A. Noe', NULL, NULL, 'Hoa Kỳ'),
(21, 'Hoàng Trạch Công', NULL, NULL, 'Việt Nam'),
(22, 'Nguyễn Nguyên Hy', NULL, NULL, 'Việt Nam'),
(23, 'Diệu Hương Thanh', NULL, NULL, 'Việt Nam'),
(24, 'Valentin Verthe', NULL, NULL, 'Pháp'),
(25, 'Kangaroo Mother', NULL, NULL, 'Hàn Quốc'),
(26, 'Rob Colson', NULL, NULL, 'Hoa Kỳ'),
(27, 'Lê Vũ', NULL, NULL, 'Việt Nam'),
(28, 'Hemma', NULL, NULL, 'Không rõ'),
(29, 'Mark Willenbrink', NULL, NULL, 'Hoa Kỳ'),
(30, 'Rosa M. Curto', NULL, NULL, 'Tây Ban Nha'),
(31, 'Suzuka', NULL, NULL, 'Nhật Bản'),
(32, 'Tiểu Lam Và Những Người Bạn', NULL, NULL, 'Việt Nam'),
(33, 'Phan', NULL, NULL, 'Việt Nam'),
(34, 'Hoàng Tuấn Công', NULL, NULL, 'Việt Nam'),
(35, 'Nguyễn Vĩnh Tiến', 1970, NULL, 'Việt Nam'),
(36, 'Trần Kiều Trinh', NULL, NULL, 'Việt Nam'),
(37, 'Lê Minh Hà', NULL, NULL, 'Việt Nam'),
(38, 'Harper Lee', 1926, 2016, 'Hoa Kỳ'),
(39, 'Lucy Maud Montgomery', 1874, 1942, 'Canada'),
(40, 'Đặng Kim Trâm', NULL, NULL, 'Việt Nam'),
(41, 'Dã Thi Văn Thùy', NULL, NULL, 'Việt Nam'),
(42, 'Hà Thủy Nguyên', NULL, NULL, 'Việt Nam'),
(43, 'Yuu Hidaka', NULL, NULL, 'Nhật Bản'),
(44, 'TJ Klune', 1982, NULL, 'Hoa Kỳ'),
(45, 'Kim Sarah', NULL, NULL, 'Hàn Quốc'),
(46, 'Hương Bùi', NULL, NULL, 'Việt Nam'),
(47, 'Toshiyuki Shiomi', NULL, NULL, 'Nhật Bản'),
(48, 'Pha Lê', 1987, NULL, 'Việt Nam'),
(49, 'Vicki Morris', NULL, NULL, 'Hoa Kỳ'),
(50, 'Robert Iger', 1951, NULL, 'Hoa Kỳ'),
(51, 'Ann Mei Chang', NULL, NULL, 'Hoa Kỳ');

-- ==========================================================
-- 5. NẠP DỮ LIỆU DANH MỤC (Từ file danhmucsach.doc) [cite: 435, 436]
-- ==========================================================
-- Tạo danh mục cha trước (ParentID = NULL)
INSERT INTO danhmuc (MaDanhMuc, TenDanhMuc, ParentID) VALUES
(100, 'Sách Kinh Tế', NULL),
(200, 'Sách Thiếu Nhi', NULL),
(300, 'Văn Học Trong Nước', NULL),
(400, 'Văn Học Nước Ngoài', NULL),
(500, 'Thường Thức Đời Sống', NULL),
(600, 'Phát Triển Bản Thân', NULL),
(700, 'Giáo Khoa - Giáo Trình', NULL);

-- Tạo danh mục con
INSERT INTO danhmuc (MaDanhMuc, TenDanhMuc, ParentID) VALUES
-- Con của Kinh Tế
(101, 'Ngoại thương', 100),
(102, 'Marketing', 100),
(103, 'Quản Trị - Lãnh Đạo', 100),
(104, 'Tài chính - Tiền tệ', 100),
-- Con của Thiếu Nhi
(201, 'Khoa học xã hội', 200),
(202, 'Mỹ Thuật, Âm Nhạc', 200),
(203, 'Truyện tranh', 200),
-- Con của VH Trong Nước
(301, 'Phê bình văn học', 300),
(302, 'Phóng sự, Ký sự', 300),
(303, 'Thơ ca', 300),
(304, 'Tiểu thuyết', 300),
-- Con của VH Nước Ngoài
(401, 'Phê bình văn học NN', 400),
(402, 'Phóng sự, Ký sự NN', 400),
(403, 'Thơ ca NN', 400),
(404, 'Tiểu thuyết NN', 400),
-- Con của Thường Thức
(501, 'Bí quyết làm đẹp', 500),
(502, 'Gia đình hạnh phúc', 500),
(503, 'Nhà ở và vật nuôi', 500),
-- Con của Phát Triển BT
(601, 'Sách học làm người', 600),
(602, 'Danh nhân', 600),
(603, 'Tâm lý - Kỹ năng sống', 600),
-- Con của Giáo Dục
(701, 'Sách giáo khoa', 700),
(702, 'Giáo trình', 700);

-- ==========================================================
-- 6. NẠP DỮ LIỆU LOẠI SÁCH (Cơ bản)

INSERT INTO loaisach (MaLoaiSach, TenLoaiSach) VALUES
(1, 'Ngoại Thương'),
(2, 'Marketing - Bán Hàng'),
(3, 'Tài Chính - Tiền Tệ'),
(4, 'Quản Trị - Lãnh Đạo'),
(5, 'Khoa Học Xã Hội'),
(6, 'Âm Nhạc & Mỹ Thuật'),
(7, 'Truyện Tranh'),
(8, 'Phê Bình Văn Học'),
(9, 'Phóng Sự, Ký Sự'),
(10, 'Thơ Ca'),
(11, 'Tiểu Thuyết'),
(12, 'Bí Quyết Làm Đẹp'),
(13, 'Gia Đình Hạnh Phúc'),
(14, 'Nhà Ở, Vật Nuôi'),
(15, 'Sách Học Làm Người'),
(16, 'Danh Nhân'),
(17, 'Tâm Lý - Kỹ Năng Sống'),
(18, 'Sách Giáo Khoa'),
(19, 'Giáo Trình Đại Học'),
(20, 'Sách Ngoại Ngữ'),
(21, 'Từ Điển'),
(22, 'Tin Học');



-- Đảm bảo định dạng chữ tiếng Việt không bị lỗi
SET NAMES utf8mb4;

-- 3. NHẬP SÁCH (Đã tính sẵn Giá Sale, % Giảm và gán đúng Mã Loại)
-- =================================================================
INSERT INTO sach (TenSach, GiaBan, PhanTramGiamGia, GiaSale, IsSale, SoLuongTon, MaTG, MaNXB, MaDanhMuc, MaLoaiSach, MoTa) VALUES 

-- 1. NGOẠI THƯƠNG (ID 1)
('Nghiệp Vụ Ngoại Thương', 124000, 0, 124000, 0, 20, 1, 4, 101, 1, 'Giáo trình cung cấp kiến thức cơ bản về lý thuyết lẫn thực tiễn ngoại thương.'),

-- 2. MARKETING (ID 2)
('Đặt tên thương hiệu', 100000, 10, 90000, 1, 20, 2, 1, 102, 2, 'Tên thương hiệu là sự khác biệt đầu tiên và lớn nhất.'),
('Ứng Dụng Agile Marketing', 195000, 0, 195000, 0, 20, 3, 2, 102, 2, 'Phương pháp tư duy linh hoạt, thích ứng nhanh với biến động.'),
('Manifest Marketing', 159000, 0, 159000, 0, 15, 4, 2, 102, 2, 'Tiếp thị nhân quả - lấy cho đi vô điều kiện làm nền tảng.'),
('Thuật Cạnh Tranh', 229000, 15, 194650, 1, 25, 5, 2, 102, 2, 'Tại sao cùng một món ăn nhưng nó lại trở nên ngon miệng hơn nhờ cách trình bày?'),
('Đổi Mới Với Integrated Brand Thinking', 250000, 0, 250000, 0, 20, 6, 3, 102, 2, 'Mô hình thương hiệu tích hợp giúp doanh nghiệp xây dựng hình ảnh toàn diện.'),
('The AI Edge - Khai Thác Thế Mạnh AI', 219000, 0, 219000, 0, 20, 7, 2, 102, 2, 'Khai thác AI trong Sales và Marketing để vượt lên đối thủ.'),
('Inbox Marketing', 198000, 0, 198000, 0, 20, 8, 1, 102, 2, 'Tăng khách hàng và chốt sales với Chatbot.'),
('Thấy Trước Doanh Thu', 238000, 0, 238000, 0, 20, 9, 1, 102, 2, 'Xây dựng cỗ máy bán hàng tạo ra doanh thu dự báo được.'),
('Bán Hàng Cho Người Giàu', 298000, 20, 238400, 1, 15, 10, 1, 102, 2, 'Thu hút những khách hàng không quan tâm đến mức giá.'),
('Phân Tích Dữ Liệu Marketing', 590000, 0, 590000, 0, 15, 11, 1, 102, 2, 'Chiến lược marketing hiệu quả: Tầm nhìn dựa trên dữ liệu.'),

-- 3. TÀI CHÍNH (ID 3)
('Nguyên Tắc Giao Dịch Trong Ngày', 195000, 0, 195000, 0, 15, 12, 4, 104, 3, 'Cẩm nang thực chiến cho giao dịch tài chính tốc độ cao.'),
('Tài Chính Cá Nhân Căn Bản', 195000, 0, 195000, 0, 20, 13, 1, 104, 3, 'Lời giải cho bài toán quản lý tiền bạc và tự do tài chính.'),
('Tự Do Tài Chính', 219000, 0, 219000, 0, 20, 14, 2, 104, 3, '100 câu chuyện thật về khởi nghiệp và kiếm thêm thu nhập.'),
('Làm Giàu Theo Chu Kỳ', 229000, 0, 229000, 0, 20, 15, 2, 104, 3, 'Chiến lược đầu tư theo chu kỳ kinh tế an toàn, hệ thống.'),
('Để Tự Do Tài Chính Từ Kinh Doanh', 255000, 0, 255000, 0, 25, 15, 3, 104, 3, 'Kế hoạch tài chính cá nhân dành riêng cho chủ doanh nghiệp.'),
('Tài Chính Dành Cho Người Sợ Số', 230000, 0, 230000, 0, 20, 16, 5, 104, 3, 'Hiểu về tài chính doanh nghiệp trong giai đoạn sinh tồn một cách đơn giản.'),

-- 4. QUẢN TRỊ (ID 4)
('Chiến Lược Phân Phối Hàng Hóa Tuyệt Vời', 125000, 0, 125000, 0, 30, 18, 9, 103, 4, 'Giành chiến thắng trong cuộc đua phân phối hàng hóa.'),
('Kỷ Nguyên Phẫn Nộ', 175000, 0, 175000, 0, 15, 17, 2, 103, 4, 'Bí kíp hạ nhiệt làn sóng phẫn nộ của cộng đồng.'),
('Giữ Người Bằng Tâm - Dẫn Dắt Bằng Tầm', 139000, 0, 139000, 0, 10, 19, 5, 103, 4, 'Dẫn dắt bằng tầm - cẩm nang quản lý nhân sự thời đại mới.'),
('Quản Trị Nguồn Nhân Lực Thời Đại Mới', 790000, 0, 790000, 0, 20, 20, 2, 103, 4, 'Textbook đầy đủ nhất về nhân sự cho sinh viên và quản lý.'),
('Tố Thư', 400000, 0, 400000, 0, 20, 21, 2, 103, 4, 'Sách trời do Hoàng Thạch Công truyền lại cho Trương Lương.'),

-- 5. KHOA HỌC XÃ HỘI (ID 5)
('Trí Tuệ Người Tiến Hóa Về Đâu?', 220000, 0, 220000, 0, 20, 22, 3, 201, 5, 'Tìm hiểu về cơ chế hợp tác giữa người và máy.'),
('Thần Số Học Chữa Lành', 105000, 10, 94500, 1, 10, 23, 3, 201, 5, 'Góc nhìn hoàn toàn khác về bộ môn tâm linh này.'),
('Hỏi Đáp Cùng Em - Thật Vậy Sao?', 219000, 0, 219000, 0, 10, 24, 1, 201, 5, '200 câu trả lời cho những gì trẻ em muốn biết.'),
('Bé Nhận Thức Thế Giới', 49000, 0, 49000, 0, 15, 25, 6, 201, 5, 'Sách tranh song ngữ Việt-Anh giúp bé nhận thức sự vật.'),
('Toán Học Khắp Quanh Ta', 42000, 0, 42000, 0, 15, 26, 6, 201, 5, 'Toán học không khô khan mà hiện diện khắp mọi nơi.'),

-- 6. ÂM NHẠC & MỸ THUẬT (ID 6)
('Acoustic Guitar', 98000, 0, 98000, 0, 15, 27, 7, 202, 6, 'Kết tinh tấm lòng của một người mê âm nhạc.'),
('Dán Hình Siêu Đáng Yêu - Mùa Xuân', 52000, 0, 52000, 0, 15, 28, 8, 202, 6, 'Hình dán ngộ nghĩnh giúp bé thỏa sức sáng tạo.'),
('Bí Quyết Vẽ Người Cho Người Mới', 179000, 0, 179000, 0, 15, 29, 9, 202, 6, 'Cẩm nang luyện kỹ năng vẽ người bằng bút chì.'),
('Giờ Học Tô Màu Của Bé', 22000, 0, 22000, 0, 15, 8, 10, 202, 6, 'Giúp bé làm quen màu sắc và luyện ngón tay.'),
('Học Vẽ 100 Mẫu Rừng Xanh', 99000, 0, 99000, 0, 15, 30, 6, 202, 6, 'Dạy vẽ muôn loài trong rừng xanh bằng hình cơ bản.'),

-- 7. TRUYỆN TRANH (ID 7)
('Cuộc Nổi Dậy Của Cô Nàng Mọt Sách', 55000, 5, 52250, 1, 20, 31, 3, 203, 7, 'Mọt sách tái sinh thành con gái binh sĩ ở thế giới khác.'),
('Vui Được Ngày Nào Hay Ngày Nấy', 195000, 0, 195000, 0, 20, 32, 6, 203, 7, 'Truyện tranh nạp năng lượng tích cực mỗi ngày.'),
('Thị Trấn Hoa Mười Giờ', 88000, 0, 88000, 0, 20, 33, 8, 203, 7, 'Cuộc sống thường ngày hài hước ở thị trấn Hoa Mười Giờ.'),

-- 8. PHÊ BÌNH VĂN HỌC (ID 8)
('Từ Điển Tiếng Việt GS Nguyễn Lân (Khảo Cứu)', 345000, 0, 345000, 0, 20, 34, 16, 301, 8, 'Tập hợp tham luận về phê bình và khảo cứu tác phẩm GS Nguyễn Lân.'),
('Từ Điển Tiếng Việt GS Nguyễn Lân (Hội NV)', 235000, 0, 235000, 0, 20, 34, 11, 301, 8, 'Chỉ ra những sai sót trong từ điển của GS Nguyễn Lân.'),

-- 9. PHÓNG SỰ, KÝ SỰ (ID 9)
('Đặng Thùy Trâm - Nhật Ký Thứ Ba', 165000, 0, 165000, 0, 20, 40, 13, 402, 9, 'Câu chuyện về nữ bác sĩ anh hùng và cuốn nhật ký thất lạc.'),

-- 10. THƠ CA (ID 10)
('Hỗn Độn Và Khu Vườn', 168000, 0, 168000, 0, 20, 35, 11, 303, 10, 'Thơ Nguyễn Vĩnh Tiến - Phép cộng thì sướng, phép trừ thì đau.'),
('Tường Vân Tự Sự', 100000, 0, 100000, 0, 20, 36, 12, 303, 10, 'Nhật ký nội tâm bằng thơ của người phụ nữ tài hoa.'),
('Cứ Cừ Cò Cư - Dã Thi Văn Thùy', 320000, 0, 320000, 0, 15, 41, 13, 403, 10, 'Không gian thư pháp thi ca dân dã và phóng túng.'),
('Nằm Xem Sao Rụng', 250000, 0, 250000, 0, 15, 42, 11, 403, 10, 'Tập thơ viết bằng suy tưởng tâm linh.'),

-- 11. TIỂU THUYẾT (ID 11)
('Kẻ Lừa Đảo Ở Khoang Hạng Nhất', 288000, 0, 288000, 0, 20, 35, 11, 304, 11, 'Trinh thám về vụ lừa đảo xuyên quốc gia của anh chàng Tống Cát.'),
('Gió Tự Thời Khuất Mặt', 172000, 0, 172000, 0, 20, 37, 11, 304, 11, 'Bức tranh đầy cảm xúc về Hà Nội những năm sau 1954.'),
('Giết Con Chim Nhại', 145000, 20, 116000, 1, 20, 38, 12, 404, 11, 'Kinh điển về nạn phân biệt chủng tộc dưới góc nhìn trẻ thơ.'),
('Rilla Dưới Mái Nhà Bên Ánh Lửa', 200000, 0, 200000, 0, 20, 39, 11, 404, 11, 'Tập cuối series Anne tóc đỏ trong bối cảnh thế chiến.'),
('Vị Hôn Thê Giản Dị Của Tôi', 139000, 0, 139000, 0, 20, 43, 1, 404, 11, 'Câu chuyện tình cảm nhẹ nhàng đời thường.'),
('Đâu Đó Ngoài Khơi Xa', 229000, 0, 229000, 0, 20, 44, 12, 404, 11, 'Hành trình tìm kiếm gia đình và sự chấp nhận.'),

-- 12. BÍ QUYẾT LÀM ĐẸP (ID 12)
('Đi Bộ Giảm Cân', 128000, 0, 128000, 0, 20, 45, 9, 501, 12, 'Bí quyết giữ dáng của siêu mẫu Kim Sarah.'),
('Cẩm Nang Độ Dáng Tại Nhà', 229000, 0, 229000, 0, 20, 46, 1, 501, 12, 'Chinh phục vóc dáng với bài tập đơn giản tại nhà.'),

-- 13. GIA ĐÌNH HẠNH PHÚC (ID 13)
('Rèn Luyện Não Bộ Cho Trẻ', 159000, 0, 159000, 0, 20, 47, 5, 502, 13, 'Trò chơi trí tuệ cho trẻ trong 12 tháng đầu đời.'),

-- 14. NHÀ Ở, VẬT NUÔI (ID 14)
('Tẩy Độc Bếp', 180000, 0, 180000, 0, 20, 48, 14, 503, 14, 'Detox gian bếp để có cuộc sống lành mạnh.'),

-- 15. SÁCH HỌC LÀM NGƯỜI (ID 15)
('Thói Quen Hạnh Phúc', 88000, 0, 88000, 0, 20, 49, 9, 601, 15, 'Bài thực hành 4 phút mỗi ngày để tăng năng lượng tích cực.'),

-- 16. DANH NHÂN (ID 16)
('Hành Trình Một Đời Người', 160000, 0, 160000, 0, 20, 50, 14, 602, 16, 'Bài học từ 15 năm làm CEO Disney của Robert Iger.'),

-- 17. TÂM LÝ - KỸ NĂNG (ID 17)
('Tác Động Tinh Gọn', 239000, 0, 239000, 0, 20, 51, 2, 603, 17, 'Áp dụng tư duy khởi nghiệp để kiến tạo giá trị xã hội.'),

-- 18. SÁCH GIÁO KHOA (ID 18)
('Sách Tiếng Việt 1', 82000, 0, 82000, 0, 20, 8, 15, 701, 18, 'Sách giáo khoa theo chương trình mới.'),

-- 19. GIÁO TRÌNH ĐẠI HỌC (ID 19)
('Giáo trình Triết học Mác - Lênin', 78000, 0, 78000, 0, 20, 8, 16, 702, 19, 'Dành cho bậc đại học, cao đẳng.');
-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;