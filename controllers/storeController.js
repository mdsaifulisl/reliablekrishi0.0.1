const Contact = require("../models/contactMdls");
const AllBlog = require("../models/allBlogDB");
const sanitizeHtml = require("sanitize-html");


exports.getDiseases = (req, res) => {
  AllBlog.fetchAllByType('disease').then(([rows]) => {
    const sanitizedRows = rows.map(row => {
      return {
        ...row,
        description: sanitizeHtml(row.description, {
          allowedTags: ['p'],   // শুধু p ট্যাগ রাখবে
          allowedAttributes: {} // কোন attribute allow করা হবে না
        })
      };
    });
    res.render('store/disease', { rows: sanitizedRows, isLoggedIn: req.session.isLoggedIn });
  });
};

exports.getHome = (req, res, next) => {
  Promise.all([
    AllBlog.fetchLimited("blog", 2).then(([rows]) => {
      return rows.map(row => {
        let cleanHtml = sanitizeHtml(row.description, {
          allowedTags: ["p"],
          allowedAttributes: {}
        });
        cleanHtml = cleanHtml.replace(/<p>(&nbsp;|\s)*<\/p>/g, "");
        return { ...row, description: cleanHtml };
      });
    }),

    AllBlog.fetchLimited("disease", 3).then(([rows]) => {
      return rows.map(row => {
        let cleanHtml = sanitizeHtml(row.description, {
          allowedTags: ["p"],
          allowedAttributes: {}
        });
        cleanHtml = cleanHtml.replace(/<p>(&nbsp;|\s)*<\/p>/g, "");
        return { ...row, description: cleanHtml };
      });
    }),

    AllBlog.fetchLimited("technology", 2).then(([rows]) => {
      return rows.map(row => {
        let cleanHtml = sanitizeHtml(row.description, {
          allowedTags: ["p"],
          allowedAttributes: {}
        });
        cleanHtml = cleanHtml.replace(/<p>(&nbsp;|\s)*<\/p>/g, "");
        return { ...row, description: cleanHtml };
      });
    })
  ])
    .then(([blogs, diseases, technologies]) => {
      res.render("store/index", {
        title: "Home",
        path: "/",
        blogs,
        diseases,
        technologies
      });
    })
    .catch(err => {
      console.error("❌ getHome Error:", err);
      res.status(500).json({ message: "Error fetching data" });
    });
};


exports.getContact = (req, res, next) => {
    Contact.fetchAll().then((diseases) => {
    res.render("store/contact", {
      title: "Contact",
      path: "/contact",
      diseases: diseases[0],
    });
  });
}; 

exports.postContact = (req, res, next) => {
  const { name, email, number, message } = req.body;

  // null check (optional)
  if (!name || !number || !message) {
    return res.status(400).send("Name, email, and message are required.");
  }

  const contact = new Contact(name, email, number, message);

  contact
    .save()
    .then(() => res.redirect("/contact"))
    .catch((err) => {
      console.error("❌ Contact Save Error:", err);
      res.status(500).send("Internal Server Error");
    });
};

exports.getAbout = (req, res, next) => {
  res.render("store/about", { title: "About", path: "/about" });
};


exports.getBlog = (req, res, next) => {
  AllBlog.fetchAll().then(([rows]) => {
    const blogRows = rows.filter(row => row.type === "blog")
    .map(row => {
      let cleanHtml = sanitizeHtml(row.description, {
        allowedTags: ['p'],
        allowedAttributes: {}
      });

      cleanHtml = cleanHtml.replace(/<p>(&nbsp;|\s)*<\/p>/g, '');

      return {
        ...row,
        description: cleanHtml
      };
      
    })

    res.render("store/blog", { title: "Blog", path: "/blog", rows: blogRows });
  });
};



exports.getDisease = (req, res, next) => {
  AllBlog.fetchAll().then(([rows]) => {
    const diseaseRows = rows
      .filter(row => row.type === "disease")
      .map(row => {
      
        let cleanHtml = sanitizeHtml(row.description, {
          allowedTags: ['p'],
          allowedAttributes: {}
        });

        cleanHtml = cleanHtml.replace(/<p>(&nbsp;|\s)*<\/p>/g, '');

        return {
          ...row,
          description: cleanHtml
        };
      });

    res.render("store/disease", { title: "Disease", path: "/disease", rows: diseaseRows });
  }).catch(err => {
    console.error(err);
    next(err);
  });
};


exports.getTechnology = (req, res, next) => {
  AllBlog.fetchAll().then(([rows]) => {
    const technologyRows = rows.filter(row => row.type === "technology").map(row => {
      let cleanHtml = sanitizeHtml(row.description, {
        allowedTags: ['p'],
        allowedAttributes: {}
      });

      cleanHtml = cleanHtml.replace(/<p>(&nbsp;|\s)*<\/p>/g, '');

      return {
        ...row,
        description: cleanHtml
      };
    })
   
    res.render("store/tec", {
      title: "Technology",
      path: "/technology",
      technology: technologyRows,
    });
  });
};

exports.getTechnologyById = (req, res, next) => {
  const id = req.params.id;
  AllBlog.findById(id).then(([rows]) => {
    res.render("store/blogDetail", {
      title: "Technology",
      path: "/technology",
      blog: rows[0],
    });
  });
};



exports.getBlogById = (req, res, next) => {
  const id = req.params.id;
  AllBlog.findById(id)
    .then(([rows]) => {
      const blog = rows[0];
      res.render("store/blogDetail", {
        title: "blog",
        path: `/blog`,
        blog: blog,
      });
    })
    .catch((err) => {
      console.error("Error fetching blog by ID:", err);
      res.status(500).render("500", {
        title: "Server Error",
        path: "/500",
      });
    });
};

exports.getDiseaseDtls = (req, res, next) => {
  const id = req.params.id;
  AllBlog.findById(id).then(([disease]) =>
    res.render("store/blogDetail", {
      title: "Disease Details",
      path: "/disease",
      blog: disease[0],
    })
  );
}; // end of getDiseaseDtls
