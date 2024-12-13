import express from 'express';
import cors from 'cors'; 
import bodyParser from 'body-parser';
import sql from 'mssql'; 
import connectToSystemDatabase from './db.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', 
}));  // Cho phép tất cả các nguồn
app.use(express.json());
//app.use(bodyParser.json());
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

// app.post('/api/page3', async(req, res)=>{
//   const { startDate, endDate } = req.body;
//   console.log("Received dates:", startDate, endDate);
//   try{
//     const pool = await connectToSystemDatabase();
//     const result = await pool.request().query('SELECT * FROM ChiTietDonHang');
//     res.json(result.recordset); // Trả về dữ liệu dưới dạng JSON
//   } catch (err) {
//       res.status(500).send(err.message);
//   }
//   fetchDataFromDatabase(res,startDate, endDate)
//         .then((result) => {
//             res.json(result); // Trả dữ liệu về cho frontend dưới dạng JSON
//         })
//         .catch((error) => {
//             res.status(500).json({ error: 'Something went wrong' }); // Nếu có lỗi, trả lỗi
//         });
// })

// const fetchDataFromDatabase = (mockData,startDate, endDate) => {
//   return new Promise((resolve) => {
//     // Giả lập lọc dữ liệu theo startDate và endDate (cần chuyển đổi ngày từ string nếu cần)
//     const filteredData = mockData.filter(item => {
//         const itemDate = new Date(item.ngay_dat_hang);
//         return (!startDate || itemDate >= new Date(startDate)) && (!endDate || itemDate <= new Date(endDate));
//     });

//     resolve(filteredData); // Trả về dữ liệu đã lọc
// });
// }
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


const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));