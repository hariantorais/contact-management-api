const pool = require("../utils/database");

const userRepository = {
  count: async ({ where }) => {
    const sql = "SELECT COUNT(id) FROM users WHERE email = $1";
    const res = await pool.query(sql, [where.email]);
    return parseInt(res.rows[0].count);
  },

  create: async ({ data }) => {
    const sql = `
        INSERT INTO users (name, email, password, "updatedAt") 
        VALUES ($1, $2, $3, NOW()) 
        RETURNING id, name, email
      `;
    const values = [data.name, data.email, data.password];
    const res = await pool.query(sql, values);
    return res.rows[0];
  },

  // --- TAMBAHKAN FUNGSI INI ---
  findFirst: async ({ where }) => {
    // Standar: Gunakan LIMIT 1 untuk efisiensi jika hanya mencari satu user
    const sql = "SELECT * FROM users WHERE email = $1 LIMIT 1";
    const res = await pool.query(sql, [where.email]);

    // Mengembalikan objek user jika ditemukan, atau undefined jika tidak ada
    return res.rows[0];
  },
};

module.exports = userRepository;
