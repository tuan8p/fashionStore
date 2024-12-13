import sql from 'mssql';

const config = {
    user: 'sa',
    password: '1634',
    server: 'localhost',
    database: 'LOLYPOP',
    options: {
        encrypt: false, // Dành cho kết nối Azure
        trustServerCertificate: true, // Dành cho kết nối local
    },
    port: 1433,
};


async function connectToSystemDatabase() {
    try {
      const pool = await sql.connect(config); // Thiết lập kết nối
      console.log('Connected to the SQL Server system database.');
      return pool; // Trả về pool để sử dụng tiếp
    } catch (err) {
      console.error('Error connecting to the database:', err.message);
      throw err; // Ném lỗi để xử lý ở nơi khác
    }
  }
  
export default connectToSystemDatabase; 
