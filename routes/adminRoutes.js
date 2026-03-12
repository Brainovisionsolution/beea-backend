const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");

// GET ALL NOMINEES
router.get("/nominations", adminController.getAllNominations);

// DOWNLOAD EXCEL
router.get("/nominations-excel", adminController.downloadNominationsExcel);

module.exports = router;