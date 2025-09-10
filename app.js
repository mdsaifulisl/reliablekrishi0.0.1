const express = require("express");
const path = require("path");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const MySQLStore = require("express-mysql-session")(session);
const pool = require("./utils/blogMySql");
require("dotenv").config();

// ======//
const rootDr = require("./utils/rootDr");
const storeRouter = require("./routes/storeRouter");
const hostRouter = require("./routes/hostRouter");
const authRouter = require("./routes/authRouter");

const app = express();

// =======//
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(rootDr, "public")));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(express.json({ limit: "100mb" }));
// =======//
app.use(
  "/bootstrap",
  express.static(path.join(rootDr, "node_modules/bootstrap/dist"))
);

app.use(cookieParser());
const sessionStore = new MySQLStore({}, pool);
app.use(
  session({
    secret: process.env.SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: sessionStore, // ✅ DB store ব্যবহার হচ্ছে
    cookie: {
      maxAge: 15 * 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
      sameSite: "lax",
    },
  })
);

// ========//

// Pass session info to all views
app.use((req, res, next) => {
  res.locals.isLoggedIn = req.session.isLoggedIn;
  next();
});

// =======//
app.use("/", storeRouter);
app.use("/", authRouter);
app.use("/", hostRouter);

// ====404====//
app.use((req, res, next) => {
  res.status(404).render("404", { title: "404", path: "404" });
});
// ====500====//
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("500");
});

sessionStore.on("error", function (error) {
  console.error("❌ MySQL Session Store Error:", error);
});

const port = process.env.PORT || 3009;
app.listen(port, () =>
  console.log(`Server is running on port http://localhost:${port}`)
);
