const express = require("express");
const { handleCreateFreshSalesLead } = require("../controllers/freshsales");

const router = express.Router();

router.post("/", handleCreateFreshSalesLead);

module.exports = router;
