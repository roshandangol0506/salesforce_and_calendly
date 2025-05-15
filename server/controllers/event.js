const axios = require("axios");
const { getTokenData } = require("../salesforce");

async function handleCreateEvent(req, res) {
  try {
    const tokenData = getTokenData();

    const eventData = {
      Subject: req.body.subject,
      StartDateTime: req.body.startDateTime,
      EndDateTime: req.body.endDateTime,
      Description: req.body.description,
      Location: req.body.location,
      WhoId: req.body.whoId,
    };

    if (!eventData.StartDateTime || !eventData.EndDateTime) {
      return res
        .status(400)
        .json({ error: "Start and end times are required" });
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
      StartDateTime: req.body.startDateTime,
      EndDateTime: req.body.endDateTime,
      Description: req.body.description,
      Location: req.body.location,
      WhoId: req.body.whoId,
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
