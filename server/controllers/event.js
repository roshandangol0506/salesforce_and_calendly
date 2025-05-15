const axios = require("axios");
const { getTokenData } = require("../salesforce");

async function handleCreateEvent(req, res) {
  try {
    const tokenData = getTokenData();

    const eventData = {
      Subject: req.body.subject, // ✅ Required
      StartDateTime: req.body.startDateTime, // ✅ Required (if using EndDateTime) Eg: 2025-05-15T10:00:00Z
      EndDateTime: req.body.endDateTime, // ✅ Required (if using StartDateTime) Eg: 2025-05-15T11:00:00Z
      Description: req.body.description,
      Location: req.body.location,
      WhoId: req.body.whoId, // Link to Contact or Lead (if you use lead id then leave whatid) (if use contact if must include whatid as account id)
      WhatId: req.body.whatId, // Link to Account, Opportunity, etc.
      ActivityDateTime: req.body.activityDateTime, // Use if Start/EndDateTime not used
      DurationInMinutes: req.body.durationInMinutes, // Optional (used if EndDateTime is not provided)
      OwnerId: req.body.ownerId, // User who owns the event (userid)
      ShowAs: req.body.showAs, // e.g., "Busy", "Free"
      IsAllDayEvent: req.body.isAllDayEvent, // true/false
      IsPrivate: req.body.isPrivate, // true/false
      IsReminderSet: req.body.isReminderSet, // true/false
      ReminderDateTime: req.body.reminderDateTime, // Timestamp
      Priority: req.body.priority, // e.g., "High", "Normal", "Low"
      RecurrenceStartDateTime: req.body.recurrenceStartDateTime,
      RecurrenceEndDateOnly: req.body.recurrenceEndDateOnly,
      RecurrenceTimeZoneSidKey: req.body.recurrenceTimeZoneSidKey,
      RecurrenceType: req.body.recurrenceType, // "RecursDaily", "RecursWeekly", etc.
      RecurrenceInterval: req.body.recurrenceInterval, // number (e.g., every 2 weeks)
    };

    if (
      !eventData.Subject ||
      !eventData.StartDateTime ||
      !eventData.EndDateTime
    ) {
      return res
        .status(400)
        .json({ error: "Subject, Start and end Date are required" });
    }

    const response = await axios.post(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Event`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, eventId: response.data.id });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create event" });
  }
}

async function handlegetEvent(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    const response = await axios.get(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Event/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    res.json({ success: true, event: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Event" });
  }
}

async function handleUpdateEvent(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    const updateData = {
      Subject: req.body.subject,
      StartDateTime: req.body.startDateTime, //  Eg: 2025-05-15T10:00:00Z
      EndDateTime: req.body.endDateTime, // Eg: 2025-05-15T11:00:00Z
      Description: req.body.description,
      Location: req.body.location,
      WhoId: req.body.whoId, // Link to Contact or Lead (if you use lead id then leave whatid) (if use contact if must include whatid as account id)
      WhatId: req.body.whatId, // Link to Account, Opportunity, etc.
      ActivityDateTime: req.body.activityDateTime, // Use if Start/EndDateTime not used
      DurationInMinutes: req.body.durationInMinutes, // Optional (used if EndDateTime is not provided)
      OwnerId: req.body.ownerId, // User who owns the event (userid)
      ShowAs: req.body.showAs, // e.g., "Busy", "Free"
      IsAllDayEvent: req.body.isAllDayEvent, // true/false
      IsPrivate: req.body.isPrivate, // true/false
      IsReminderSet: req.body.isReminderSet, // true/false
      ReminderDateTime: req.body.reminderDateTime, // Timestamp
      Priority: req.body.priority, // e.g., "High", "Normal", "Low"
      RecurrenceStartDateTime: req.body.recurrenceStartDateTime,
      RecurrenceEndDateOnly: req.body.recurrenceEndDateOnly,
      RecurrenceTimeZoneSidKey: req.body.recurrenceTimeZoneSidKey,
      RecurrenceType: req.body.recurrenceType, // "RecursDaily", "RecursWeekly", etc.
      RecurrenceInterval: req.body.recurrenceInterval, // number (e.g., every 2 weeks)
    };

    await axios.patch(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Event/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "Event updated successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to update Event" });
  }
}

async function handleDeleteEvent(req, res) {
  try {
    const { id } = req.params;

    const tokenData = getTokenData();

    await axios.delete(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Event/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    res.json({ success: true, message: "Successfully deleted Event" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to delete Event" });
  }
}

module.exports = {
  handleCreateEvent,
  handlegetEvent,
  handleUpdateEvent,
  handleDeleteEvent,
};
