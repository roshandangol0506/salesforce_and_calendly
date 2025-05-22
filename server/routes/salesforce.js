const express = require("express");
const {
  handleCreateLead,
  handleGetAllLead,
  handleUpdateLead,
  handleDeleteLead,
  handleCreateContact,
  handleGetContact,
  handleUpdateContact,
  handleDeleteContact,
  handleCreateEvent,
  handlegetEvent,
  handleUpdateEvent,
  handleDeleteEvent,
  handleCreateAccount,
  handleGetAccount,
  handleUpdateAccount,
  handleDeleteAccount,
  handleGetSpecificLead,
} = require("../controllers/salesforce");

const router = express.Router();

router.post("/lead/", handleCreateLead);
router.get("/lead", handleGetAllLead);
router.get("/lead/:id", handleGetSpecificLead);
router.put("/lead/:id", handleUpdateLead);
router.delete("/lead/:id", handleDeleteLead);

router.post("/contact/", handleCreateContact);
router.get("/contact/:id", handleGetContact);
router.put("/contact/:id", handleUpdateContact);
router.delete("/contact/:id", handleDeleteContact);

router.post("/event/", handleCreateEvent);
router.get("/event/:id", handlegetEvent);
router.patch("/event/:id", handleUpdateEvent);
router.delete("/event/:id", handleDeleteEvent);

router.post("/account/", handleCreateAccount);
router.get("/account/:id", handleGetAccount);
router.patch("/account/:id", handleUpdateAccount);
router.delete("/account/:id", handleDeleteAccount);

module.exports = router;
