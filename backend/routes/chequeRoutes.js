const express = require("express");
const router = express.Router();
const chequeController = require("../controllers/chequeController");

router.post("/", chequeController.createCheque);
router.get("/", chequeController.getAllCheques);
router.delete("/:id", chequeController.deleteCheque);

module.exports = router;