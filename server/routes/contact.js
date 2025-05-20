const express = require("express");
const {
  handleCreateContact,
  handleGetContact,
  handleUpdateContact,
  handleDeleteContact,
} = require("../controllers/contact");

const router = express.Router();

router.post("/", handleCreateContact);
router.get("/:id", handleGetContact);
router.put("/:id", handleUpdateContact);
router.delete("/:id", handleDeleteContact);

module.exports = router;
