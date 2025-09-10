const express = require("express");
const router = express.Router();


const storeController = require("../controllers/storeController");
const isAuth = require("../controllers/isAuth");
router.get("/", storeController.getHome);
router.get("/contact", storeController.getContact);
router.get("/about", storeController.getAbout);
router.get("/blog", storeController.getBlog);
router.get("/disease", storeController.getDisease);
router.get("/technology", storeController.getTechnology);
router.get("/technology/:id", storeController.getTechnologyById);
router.get("/blog/:id", storeController.getBlogById);
router.get('/diseaseDtls/:id', storeController.getDiseaseDtls);
// ====
router.post("/contact", storeController.postContact); 

module.exports = router;