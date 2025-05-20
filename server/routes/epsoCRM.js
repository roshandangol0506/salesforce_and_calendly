const express = require("express");
const {
  handleEpsoCrmContact,
  handleEspoCrmAccount,
} = require("../controllers/epsoCRM");
const router = express.Router();

router.post("/contact", handleEpsoCrmContact);
router.post("/account", handleEspoCrmAccount);

module.exports = router;
