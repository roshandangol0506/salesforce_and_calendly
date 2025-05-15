const express = require("express");
const {
  handleCreateAccount,
  handleGetAccount,
  handleUpdateAccount,
  handleDeleteAccount,
} = require("../controllers/account");

const router = express.Router();

router.post("/account", handleCreateAccount);
router.get("/account/:id", handleGetAccount);
router.patch("/account/:id", handleUpdateAccount);
router.delete("/account/:id", handleDeleteAccount);

module.exports = router;
