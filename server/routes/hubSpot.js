const express = require("express");
const { handleHubSpotContact } = require("../controllers/hotSpot");

const router = express.Router();

router.post("/", handleHubSpotContact);

module.exports = router;
