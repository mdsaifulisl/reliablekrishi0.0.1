const express = require("express");
const path = require("path");
const router = express.Router();

const authController = require("../controllers/authController");

router.get("/login", authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

module.exports = router;