// models/Contact.js
// MySQL-based Contact model (replaces old Mongoose model)

const pool = require('../db/connection');

class Contact {
  /**
   * Save a new contact message to the MySQL database.
   * @param {string} name
   * @param {string} email
   * @param {string} message
   * @returns {object} saved record
   */
  static async create({ name, email, message }) {
    const sql = `
      INSERT INTO contacts (name, email, message)
      VALUES (?, ?, ?)
    `;
    const [result] = await pool.execute(sql, [name, email, message]);

    // Return the newly inserted row
    return {
      id:         result.insertId,
      name,
      email,
      message,
      created_at: new Date()
    };
  }

  /**
   * Fetch all contact messages from the database.
   * @returns {Array} list of contact records
   */
  static async findAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM contacts ORDER BY created_at DESC'
    );
    return rows;
  }

  /**
   * Find a contact message by ID.
   * @param {number} id
   * @returns {object|null}
   */
  static async findById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM contacts WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  }
}

module.exports = Contact;
