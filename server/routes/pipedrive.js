const {
  handlePipelineDeal,
  handleGetPipedriveDeal,
  handleUpdatePipedriveDeal,
  handleDeletePipedriveDeal,
  handlePipedriveContact,
  handleGetPipedriveContact,
  handleUpdatePipedriveContact,
  handleDeletePipedriveContact,
  handlePipedriveOrganization,
  handleGetPipedriveOrg,
  handleUpdatePipedriveOrg,
  handleDeletePipedriveOrg,
  handlePipedriveProduct,
  handlePipedriveLead,
} = require("../controllers/pipedrive");

const express = require("express");

const router = express.Router();

router.post("/deal", handlePipelineDeal);
router.get("/deal/:id", handleGetPipedriveDeal);
router.put("/deal/:id", handleUpdatePipedriveDeal);
router.delete("/deal/:id", handleDeletePipedriveDeal);

router.post("/contact", handlePipedriveContact);
router.get("/contact/:id", handleGetPipedriveContact);
router.put("/contact/:id", handleUpdatePipedriveContact);
router.delete("/contact/:id", handleDeletePipedriveContact);

router.post("/organization", handlePipedriveOrganization);
router.get("/organization/:id", handleGetPipedriveOrg);
router.put("/organization/:id", handleUpdatePipedriveOrg);
router.delete("/organization/:id", handleDeletePipedriveOrg);

router.post("/product", handlePipedriveProduct);

router.post("/lead", handlePipedriveLead);

module.exports = router;
