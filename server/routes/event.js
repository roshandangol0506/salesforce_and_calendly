const express = require("express");
const {
  handleCreateEvent,
  handlegetEvent,
  handleUpdateEvent,
  handleDeleteEvent,
} = require("../controllers/event");

const router = express.Router();

router.post("/event", handleCreateEvent);
router.get("/event/:id", handlegetEvent);
router.patch("/event/:id", handleUpdateEvent);
router.delete("/event/:id", handleDeleteEvent);

module.exports = router;
