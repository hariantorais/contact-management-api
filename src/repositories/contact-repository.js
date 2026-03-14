const pool = require("../utils/database");

const contactRepository = {
  create: async (data) => {
    console.log("data diterima dari db layer: ", data);

    const sql = `
        INSERT INTO contacts ("firstName", "lastName", phone, email, "userId", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING *`;

    const values = [
      data.firstName,
      data.lastName,
      data.phone,
      data.email,
      data.userId,
    ];
    const res = await pool.query(sql, values);
    return res.rows[0];
  },

  findById: async (id) => {
    const sql = "SELECT * FROM contacts WHERE id = $1";
    const res = await pool.query(sql, [id]);
    return res.rows[0];
  },

  findByUser: async (userId) => {
    const sql = 'SELECT * FROM contacts WHERE "userId" = $1 ORDER BY id DESC';
    const res = await pool.query(sql, [userId]);
    return res.rows;
  },

  update: async (id, data) => {
    const sql = `
        UPDATE contacts
        SET "firstName" = $1, "lastName" = $2, phone = $3, email = $4, "updatedAt" = NOW()
        WHERE id = $5
        RETURNING *`;
    const values = [data.firstName, data.lastName, data.phone, data.email, id];
    const res = await pool.query(sql, values);
    return res.rows[0];
  },

  delete: async (id) => {
    const sql = "DELETE FROM contacts WHERE id = $1";
    await pool.query(sql, [id]);
  },

  search: async (userId, filters) => {
    // 1. base query
    let sql = 'SELECT * FROM contacts WHERE "userId" = $1';
    const values = [userId];
    let paramIndex = 2;

    // 2. filter dinamis (search)
    if (filters.name) {
      sql += ` AND ("firstName" ILIKE $${paramIndex} OR "lastName" ILIKE $${paramIndex})`;
      values.push(`%${filters.name}%`);
      paramIndex++;
    }

    if (filters.phone) {
      sql += ` AND "phone" ILIKE $${paramIndex}`;
      values.push(`%${filters.phone}%`);
      paramIndex++;
    }

    // 3. pagination (limit & offset)
    const limit = parseInt(filters.size) || 10;
    const page = parseInt(filters.page) || 1;
    const offset = (page - 1) * limit;

    sql += ` ORDER BY id DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    values.push(limit, offset);

    const res = await pool.query(sql, values);

    // 4. hitung total data (untuk info di frontend)
    const countSql = 'SELECT COUNT(*) FROM contacts WHERE "userId" = $1';
    const countRes = await pool.query(countSql, [userId]);

    return {
      data: res.rows,
      paging: {
        page: page,
        total_item: parseInt(countRes.rows[0].count),
        total_page: Math.ceil(parseInt(countRes.rows[0].count) / limit),
      },
    };
  },
};

module.exports = contactRepository;
