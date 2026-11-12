const express = require("express");
const router = express.Router();
const resortController = require("../controllers/resortController");

router.get("/", resortController.getResorts);
router.get("/:id", resortController.getResortById);

module.exports = router;

