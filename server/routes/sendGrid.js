const express = require("express");
const multer = require("multer");
const upload = multer();

const {
  handleSendGrid,
  createCampaign,
  schedualCampaign,
  createList,
  addContacts,
  createTemplate,
  addVersionToTemplate,
  sendWithDynamicTemplate,
} = require("../controllers/sendGrid");

const router = express.Router();

router.post("/", upload.single("attachment"), handleSendGrid);

router.post("/campaign", createCampaign);

router.put("/schedule/:id", schedualCampaign);

router.post("/list", createList);

router.post("/contact/", addContacts);

router.post("/template/", createTemplate);

router.post("/template/version/", addVersionToTemplate);

router.post("/template/sendmail", sendWithDynamicTemplate);

module.exports = router;
