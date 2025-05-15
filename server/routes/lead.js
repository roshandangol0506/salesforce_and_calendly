const express = require("express");
const {
  handleCreateLead,
  handleGetLead,
  handleUpdateLead,
  handleDeleteLead,
} = require("../controllers/lead");

const router = express.Router();

router.post("/createlead", handleCreateLead);
router.get("/lead/:id", handleGetLead);
router.put("/lead/:id", handleUpdateLead);
router.delete("/lead/:id", handleDeleteLead);

module.exports = router;
