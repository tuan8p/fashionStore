import poolPromise from '../config/db.js';

export async function getAllUsers(req, res) {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query('SELECT * FROM TaiKhoan');
        res.status(200).json(result.recordset);
    } catch (err) {
        res.status(500).send(err.message);
    }
}

