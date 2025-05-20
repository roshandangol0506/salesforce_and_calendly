const express = require("express");
const {
  handleCreateLead,
  handleGetLead,
  handleUpdateLead,
  handleDeleteLead,
} = require("../controllers/lead");

const router = express.Router();

router.post("/", handleCreateLead);
router.get("/:id", handleGetLead);
router.put("/:id", handleUpdateLead);
router.delete("/:id", handleDeleteLead);

module.exports = router;
