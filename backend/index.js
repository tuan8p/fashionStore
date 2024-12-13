import express from 'express';
import cors from 'cors'; 
import sql from 'mssql'; 
import connectToSystemDatabase from './db.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', 
}));  
app.use(express.json());
const port = 5000;

app.get('/', async (req, res) =>{
    try {
        const pool = await connectToSystemDatabase(); // Kết nối tới DB
        const result = await pool.request().query('SELECT @@VERSION AS version'); // Truy vấn kiểm tra
    
        res.status(200).json({
          message: 'Connected to the database successfully!',
          sqlServerVersion: result.recordset[0].version
        });
    
        pool.close(); // Đóng kết nối sau khi xong
      } catch (error) {
        res.status(500).json({
          message: 'Failed to connect to the database',
          error: error.message
        });
      }
});

app.get('/api/DonHang', async(req, res)=>{
    try{
        const pool = await connectToSystemDatabase();
        const result = await pool.request().query('SELECT * FROM DonHang');
        res.json(result.recordset); // Trả về dữ liệu dưới dạng JSON
    } catch (err) {
        res.status(500).send(err.message); // Nếu có lỗi
}})

app.post(`/api/update-order-status`, async (req, res) => {
  const { ma_don_hang, trang_thai_don_hang } = req.body;
  console.log('Received parameters:', ma_don_hang, trang_thai_don_hang);
  if (!ma_don_hang || !trang_thai_don_hang) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  try {
    // Kết nối đến SQL Server
    const pool = await connectToSystemDatabase();

    // Gọi thủ tục UpdateTrangThaiDonHang trong SQL Server
    const result = await pool.request()
      .input('ma_don_hang', sql.VarChar(20), ma_don_hang)
      .input('trang_thai_don_hang', sql.NVarChar(50), trang_thai_don_hang)
      .execute('dbo.UpdateTrangThaiDonHang');

      if (result.returnValue == 1) {
      res.status(200).json({ message: 'Order status updated successfully' });
    } else {
      res.status(404).json({ error: 'Order not found' });
    }

    pool.close();
  } catch (err) {
    console.error('Error updating order status:', err.message);
    res.status(500).json({ message: 'Failed to update order status', error: err.message });
  }
});

app.post(`/api/delete-order`, async (req, res) => {
  const { ma_don_hang } = req.body;

  if (!ma_don_hang) {
    return res.status(400).json({ error: 'Thiếu ma_don_hang' });
  }

  try {
    const pool = await connectToSystemDatabase();
    const result = await pool.request()
      .input('ma_don_hang', sql.VarChar(20), ma_don_hang)
      .execute('dbo.DeleteDonHang');
    if (result.returnValue == 1) {
      res.status(200).json({ message: 'Order deleted successfully' });
    } else {
      res.status(404).json({ error: 'Đơn hàng không tồn tại' });
    }
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(400).json({error:'Không thể xóa đơn hàng vì trạng thái không phải "Đang xử lý".'})

  }
});

app.post('/api/create-order', async (req, res) => {
  const { ma_tai_khoan, phuong_thuc, ma_khuyen_mai} = req.body;

  try {
    const pool = await connectToSystemDatabase();

    const result = await pool.request()
      .input('ma_tai_khoan', sql.VarChar(10), ma_tai_khoan)
      .input('phuong_thuc', sql.NVarChar(50), phuong_thuc)
      .input('ma_khuyen_mai', sql.VarChar(20), ma_khuyen_mai)
      .execute('dbo.InsertDonHang'); // Gọi thủ tục InsertDonHang

    res.status(200).json({ message: 'Đơn hàng đã được tạo thành công!' });
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: 'Có lỗi xảy ra khi tạo đơn hàng!', error: error.message });
  }
});

// API gọi hàm TinhTongTienDonHang
app.post('/api/calculate-order-total', async (req, res) => {
  const { startDate, endDate } = req.body;
  console.log('Received Start Date:', startDate);  // In giá trị startDate từ frontend
  console.log('Received End Date:', endDate);
  // Kiểm tra thông tin đầu vào
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Vui lòng cung cấp tham số: NgayBatDau và NgayKetThuc' });
  }

  try {
    const pool = await connectToSystemDatabase();
    const result = await pool.request()
      .input('NgayBatDau', sql.Date, startDate)
      .input('NgayKetThuc', sql.Date, endDate)
      .query(`
        SELECT * 
        FROM dbo.TinhTongTienDonHang(@NgayBatDau, @NgayKetThuc)
      `);

    const rows = result.recordset;

    // Gửi phản hồi kèm thông tin đầu vào và kết quả
    if (Array.isArray(rows) && rows.length > 0) {
    res.status(200).json({
      input: {
        startDate,
        endDate,
      },
      output: rows,
    });
  } else {
    // Nếu không có dữ liệu hoặc không phải mảng
    res.status(404).json({ error: 'Không tìm thấy dữ liệu trong khoảng thời gian này' });
  }
  } catch (error) {
    console.error('Error calculating order total:', error);
    res.status(500).json({ error: 'Có lỗi xảy ra khi tính tổng đơn hàng', details: error.message });
  }
});

app.post('/api/so-luong-tinh-trang-don-hang', async (req, res) => {
  const { ma_tai_khoan, ngay_bat_dau, ngay_ket_thuc } = req.body;
  console.log('Received data:', req.body);

  try {

    // Kết nối đến cơ sở dữ liệu
    const pool = await connectToSystemDatabase();

    // Thực thi thủ tục
    const result = await pool.request()
      .input('ma_tai_khoan', sql.VarChar(20), ma_tai_khoan || null)
      .input('ngay_bat_dau', sql.Date, ngay_bat_dau || null)
      .input('ngay_ket_thuc', sql.Date, ngay_ket_thuc || null)
      .execute('dbo.SoLuongTinhTrangDonHang');  // Gọi thủ tục đã tạo trong SQL

    // Trả về kết quả cho frontend
    const rows = result.recordsets;  // Kết quả của procedure trả về dưới dạng recordsets
        if (rows && rows.length > 0) {
            res.status(200).json({ data: rows });
        } else {
            res.status(404).json({ error: 'Không có dữ liệu' });
        }
    } catch (error) {
        console.error('Error calculating order data:', error);
        res.status(500).json({ error: 'Có lỗi khi tính tổng đơn hàng', details: error.message });
    }
});

app.get('/api/products', async (req, res) => {
  try {
      const pool = await connectToSystemDatabase();

      const result = await pool.request().query(`
        SELECT ma_san_pham, ten_san_pham, mo_ta_san_pham, don_gia
        FROM dbo.SanPham
    `);

    console.log('Products retrieved:', result.recordset);

    // Sửa lại Promise.all và chắc chắn rằng `product` được truy cập đúng cách
    const products = await Promise.all(result.recordset.map(async (product) => {
      try {
        const ratingResult = await pool.request()
            .input('ma_san_pham', sql.VarChar(20), product.ma_san_pham)
            .execute('dbo.sp_CalculateAverageRating');

        console.log('Rating result for product', product.ma_san_pham, ratingResult.recordset);

        const averageRating = ratingResult.recordset[0]?.diem_trung_binh || 'Chưa có đánh giá';
        return {
          ...product,
          diem_trung_binh: averageRating // Đảm bảo `diem_trung_binh` được gán đúng
        };
      } catch (error) {
        console.error('Error fetching rating for product', product.ma_san_pham, error);
        return {
          ...product,
          diem_trung_binh: 'Error fetching rating' // Trả về lỗi nếu không lấy được điểm
        };
      }
    }));

    console.log('Final products data with rating:', products);

    // Trả về danh sách sản phẩm với điểm trung bình
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products and ratings:', error);
    res.status(500).json({ error: 'Lỗi khi lấy thông tin sản phẩm và điểm đánh giá.' });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));