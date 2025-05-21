const express = require("express");
const {
  createZohoLead,
  createZohoAccount,
  handleGetZohoLead,
  handleUpdateZohoLead,
  handleDeleteZohoLead,
  handleGetZohoAccount,
  handleUpdateZohoAccount,
  handleDeleteZohoAccount,
} = require("../controllers/zoho");

const router = express.Router();

// This below is created just to add in zoho console api as localhost:8000/oauth/callback
// router.get("/oauth/callback", getZohoAccessToken);

router.post("/lead", createZohoLead);
router.get("/lead/:id", handleGetZohoLead);
router.patch("/lead/:id", handleUpdateZohoLead);
router.delete("/lead/:id", handleDeleteZohoLead);

router.post("/account", createZohoAccount);
router.get("/account/:id", handleGetZohoAccount);
router.patch("/account/:id", handleUpdateZohoAccount);
router.delete("/account/:id", handleDeleteZohoAccount);

module.exports = router;
