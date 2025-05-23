const express = require("express");
const multer = require("multer");
const upload = multer();

const {
  GenerateNewApiKey,
  deleteOldApiKey,
  handleSendGrid,
  createCampaign,
  schedualCampaign,
  createList,
  addContacts,
  createTemplate,
  addVersionToTemplate,
  sendWithDynamicTemplate,
  getAllApiKeys,
} = require("../controllers/sendGrid");

const router = express.Router();

router.post("/api", GenerateNewApiKey);
router.delete("/api/:id", deleteOldApiKey);
router.get("/api", getAllApiKeys);

router.post("/", upload.single("attachment"), handleSendGrid);

router.post("/campaign", createCampaign);

router.put("/schedule/:id", schedualCampaign);

router.post("/list", createList);

router.post("/contact/", addContacts);

router.post("/template/", createTemplate);

router.post("/template/version/", addVersionToTemplate);

router.post("/template/sendmail", sendWithDynamicTemplate);

module.exports = router;
