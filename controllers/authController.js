exports.getLogin = (req, res, next) => {
  res.render("auth/login", { 
    title: "Login", 
    path: "/login", 
    error: "" 
  });
};
// =====
// post login
exports.postLogin = (req, res, next) => {
  const { email, password } = req.body;
  const secretEmail = process.env.SECRET_EMAIL;
  const secretPassword = process.env.SECRET_PASSWORD;

  if (email === secretEmail && password === secretPassword) {
    req.session.isLoggedIn = true;
    req.session.email = email;
  
    console.log("✅ Login matched. Before save:", req.session);
  
    return req.session.save((err) => {
      if (err) {
        console.error("❌ Session save error:", err);
        return res.render("auth/login", {
          title: "Login",
          path: "/login",
          error: "Session save failed. Please try again.",
        });
      }
      console.log("✅ Session saved. After save:", req.session);
      res.redirect("/");
    });
  }
   else {
    res.render("auth/login", {
      title: "Login",
      path: "/login",
      error: "Invalid email or password. Try again.",
    });
  }
};

// =====
// logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("❌ Session destroy error:", err);
    }
    res.redirect("/");
  });
};
