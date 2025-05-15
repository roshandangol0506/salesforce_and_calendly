const express = require("express");
const {
  handleCreateContact,
  handleGetContact,
  handleUpdateContact,
  handleDeleteContact,
} = require("../controllers/contact");

const router = express.Router();

router.post("/contact", handleCreateContact);
router.get("/contact/:id", handleGetContact);
router.put("/contact/:id", handleUpdateContact);
router.delete("/contact/:id", handleDeleteContact);

module.exports = router;
