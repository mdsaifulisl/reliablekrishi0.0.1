const db = require("../utils/blogMySql");
const { v4: uuidv4 } = require("uuid");

module.exports = class AllBlog {
    constructor (title, type, description, image) {
        this.id = uuidv4();
        this.title = title;
        this.type = type;
        this.description = description;
        this.image = image;
    }

    save() {
        return db.execute( 
            "INSERT INTO blogs (id, title, type, description, image) VALUES (?, ?, ?, ?, ?)",
            [this.id, this.title, this.type, this.description, this.image]
        );
    }

    static fetchAll() {
        return db.execute("SELECT * FROM blogs ORDER BY id DESC");
    }

      
    static findById(id) {
        return db.execute("SELECT * FROM blogs WHERE id = ?", [id]);
    }
    static fetchLimited(type, limit) {
        return db.execute(
            `SELECT * FROM blogs WHERE type = ? ORDER BY created_at DESC LIMIT ${limit}`, 
            [type]
        );
    }
    
    static fetchAllByType(type) {
        return db.execute("SELECT * FROM blogs WHERE type = ?", [type]);
    }
    static delete(id) {
        return db.execute("DELETE FROM blogs WHERE id = ?", [id]);
    }

   

    static update(id, title, description, image, type) {
        return db.execute(
            "UPDATE blogs SET title = ?, description = ?, image = ?, type = ? WHERE id = ?",
            [title, description, image, type, id]
        );
    }
    
      
    
}