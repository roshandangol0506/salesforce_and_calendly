const express = require("express");
const {
  handleHubSpotContact,
  handleGetHubspotContact,
  handleUpdateHubspotContact,
  handleDeleteHubspotContact,
  handleHubSpotDeal,
  handleGetHubspotDeal,
  handleUpdateHubspotDeal,
  handleDeleteHubspotDeal,
} = require("../controllers/hotSpot");

const router = express.Router();

router.post("/contact", handleHubSpotContact);
router.get("/contact/:id", handleGetHubspotContact);
router.patch("/contact/:id", handleUpdateHubspotContact);
router.delete("/contact/:id", handleDeleteHubspotContact);

router.post("/deal", handleHubSpotDeal);
router.get("/deal/:id", handleGetHubspotDeal);
router.patch("/deal/:id", handleUpdateHubspotDeal);
router.delete("/deal/:id", handleDeleteHubspotDeal);

module.exports = router;
