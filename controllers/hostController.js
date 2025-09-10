const fs = require("fs").promises;
const path = require("path");


const Contact = require("../models/contactMdls");
const AllBlog = require("../models/allBlogDB"); 


exports.getAddBlog = (req, res, next) => {
  res.render("host/updateAddpanel", { title: "Add blog", path: "/blog" });
};

exports.postAddBlog = (req, res, next) => {
  const { title, type, description } = req.body;
  const image = req.file ? "/uploads/" + req.file.filename : null; // ✅ never undefined

  if (!title || !description) {
    return res.status(400).send("Title and description are required.");
  }

  const blog = new AllBlog(title, type, description, image);

  blog
    .save()
    .then(() => res.redirect("/blog"))
    .catch((err) => {
      console.error("❌ Blog Save Error:", err);
      res.status(500).send("Error saving blog.");
    });
};


// Delete blog

exports.deleteBlog = async (req, res, next) => {
  const id = req.params.id;
  try {
    const [rows] = await AllBlog.findById(id);
    const blog = rows[0];

    if (!blog) return res.status(404).send("Blog not found");

    // ---- Cover Image delete ----
    if (blog.image) {
      const coverPath = path.join(__dirname, "..", "public", blog.image.replace(/^\/+/, ''));
      try {
        await fs.unlink(coverPath);
      } catch (err) {
        console.error("⚠️ Cover image delete error:", err.message);
      }
    }
 
    // ---- Description images delete ----
    if (blog.description) {
      // regex দিয়ে সব img src বের করুন
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      let match;

      while ((match = imgRegex.exec(blog.description)) !== null) {
        const imgSrc = match[1]; // যেমন /uploads/12345.jpg
        const imgPath = path.join(__dirname, "..", "public", imgSrc.replace(/^\/+/, ''));
        try {
          await fs.unlink(imgPath);
          console.log("🖼 Deleted description image:", imgPath);
        } catch (err) {
          console.error("⚠️ Could not delete description image:", imgPath, err.message);
        }
      }
    }

    // ---- Database থেকে delete ----
    await AllBlog.delete(id);

    // Redirect back
    const backURL = req.get("referer") || "/";
    res.redirect(backURL);

  } catch (err) {
    console.error("❌ Blog Delete Error:", err);
    res.status(500).send("Internal server error.");
  }
};



// get edit blog


// GET Edit page
exports.getEditBlogs = (req, res, next) => {
  const blogId = req.params.id;

  AllBlog.findById(blogId)
    .then(([rows]) => {
      if (!rows.length) return res.status(404).send("Blog not found");
      const blog = rows[0];
      res.render("host/editBlog", { blog, title: "Edit Blog", path: "/blog/edit" });
    })
    .catch(err => {
      console.error(err);
      res.status(500).send("Internal server error");
    });
};

// POST Update
exports.postEditBlogs = async (req, res, next) => {
  const blogId = req.params.id;
  const { title, type, description } = req.body;
  let imagePath;

  try {
    const [rows] = await AllBlog.findById(blogId);
    if (!rows.length) return res.status(404).send("Blog not found");

    const blog = rows[0];

    if (req.file) {
      imagePath = '/uploads/' + req.file.filename;

      if (blog.image) {
        const fs = require('fs').promises;
        const oldPath = path.join(__dirname, "..", "public", blog.image);
        try {
          await fs.unlink(oldPath);
        } catch (err) {
          console.error("⚠️ Could not delete old image:", err.message);
        }
      }
    } else {
      imagePath = blog.image; 
    }

    await AllBlog.update(blogId, title, description, imagePath, type);

    res.redirect('/');

  } catch (err) {
    console.error("❌ Update failed:", err);
    res.status(500).send("Update failed");
  }
};

// contact
exports.getContactForm = (req, res, next) => {
  Contact.fetchAll().then(([contacts]) => {
    res.render("host/contactList", {
      title: "All Contacts",
      path: "/contacts",
      contacts,
    });
  })
};


exports.getAllContacts = (req, res, next) => {
  Contact.fetchAll()
    .then(([contacts]) => {
      res.render("host/contactList", {
        title: "All Contacts",
        path: "/contacts",
        contacts,
      });
    })
    .catch((err) => {
      console.error("❌ Error fetching contacts:", err);
      res.status(500).send("Server Error");
    });
};

exports.deleteContact = (req, res, next) => {
  const id = req.params.id;
  Contact.delete(id)
    .then(() => res.redirect("/contact-form"))
    .catch((err) => {
      console.error("❌ Error deleting contact:", err);
      res.status(500).send("Delete Failed");
    });
};
