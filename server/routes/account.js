const express = require("express");
const {
  handleCreateAccount,
  handleGetAccount,
  handleUpdateAccount,
  handleDeleteAccount,
} = require("../controllers/account");

const router = express.Router();

router.post("/", handleCreateAccount);
router.get("/:id", handleGetAccount);
router.patch("/:id", handleUpdateAccount);
router.delete("/:id", handleDeleteAccount);

module.exports = router;
