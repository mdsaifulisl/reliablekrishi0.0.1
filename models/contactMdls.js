const db = require('../utils/blogMySql');
const { v4: uuidv4 } = require('uuid');

module.exports = class Contact {
  constructor(name, email, number, message) {
  this.id = uuidv4();
  this.name = name || null;
  this.email = email || null;
  this.number = number || null;
  this.message = message || null;
}


  save() {
    return db.execute(
      'INSERT INTO contact (id, name, email, number, message) VALUES (?, ?, ?, ?, ?)',
      [this.id, this.name, this.email, this.number, this.message]
    );
  }

  static fetchAll() {
    return db.execute('SELECT * FROM contact ORDER BY id DESC');
  }

  static delete(id) {
    return db.execute('DELETE FROM contact WHERE id = ?', [id]);
  }


};






