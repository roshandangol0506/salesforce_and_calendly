const express = require("express");
const {
  createZohoLead,
  getZohoAccessToken,
  createZohoAccount,
} = require("../controllers/zoho");

const router = express.Router();

// This below is created just to add in zoho console api as localhost:8000/oauth/callback
// router.get("/oauth/callback", getZohoAccessToken);

router.post("/zoho/lead", createZohoLead);
router.post("/zoho/account", createZohoAccount);

module.exports = router;
