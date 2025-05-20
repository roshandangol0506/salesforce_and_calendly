const { handlePipelineDeal } = require("../controllers/pipedrive");

const express = require("express");

const router = express.Router();

router.post("/", handlePipelineDeal);

module.exports = router;
