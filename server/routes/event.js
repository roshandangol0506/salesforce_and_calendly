const express = require("express");
const {
  handleCreateEvent,
  handlegetEvent,
  handleUpdateEvent,
  handleDeleteEvent,
} = require("../controllers/event");

const router = express.Router();

router.post("/", handleCreateEvent);
router.get("/:id", handlegetEvent);
router.patch("/:id", handleUpdateEvent);
router.delete("/:id", handleDeleteEvent);

module.exports = router;
