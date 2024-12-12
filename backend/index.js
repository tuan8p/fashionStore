import express from 'express';
import cors from 'cors'; // For handling CORS
import sql from 'mssql'; 
import connectToSystemDatabase from './db.js';

const app = express();
app.use(cors());
app.use(express.json());
const port = 5000;

// const config = {
//     user: "sa",
//     passwork:"1634",
//     server: "localhost",
//     database: "LOLYPOP",
//     options: {
//         trustServerCertificate: true,
//         trustedConnection: false,
//         enableArithAbort: true,
//         //instancename:
//     },
//     port:1433 
// }

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

app.get('/api/SanPham', async(req, res)=>{
  try{
      const pool = await connectToSystemDatabase();
      const result = await pool.request().query('SELECT * FROM SanPham');
      res.json(result.recordset); // Trả về dữ liệu dưới dạng JSON
  } catch (err) {
      res.status(500).send(err.message); // Nếu có lỗi
}})

app.get('/api/ChiTietDonHang', async(req, res)=>{
  try{
      const pool = await connectToSystemDatabase();
      const result = await pool.request().query('SELECT * FROM ChiTietDonHang');
      res.json(result.recordset); // Trả về dữ liệu dưới dạng JSON
  } catch (err) {
      res.status(500).send(err.message); // Nếu có lỗi
}})



const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));