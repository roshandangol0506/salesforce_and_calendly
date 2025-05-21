const axios = require("axios");
require("dotenv").config();

const hubspot = axios.create({
  baseURL: "https://api.hubapi.com/crm/v3/objects",
  headers: {
    Authorization: `Bearer ${process.env.HS_TOKEN}`, // <- Replace with your token
    "Content-Type": "application/json",
  },
});

async function handleHubSpotContact(req, res) {
  const { firstname, lastname, email, phone } = req.body;

  try {
    const response = await hubspot.post("/contacts", {
      properties: {
        firstname,
        lastname,
        email,
        phone,
      },
    });

    res.status(200).json({ message: "Contact created", data: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create contact" });
  }
}

async function handleGetHubspotContact(req, res) {
  try {
    const { id } = req.params;
    const response = await hubspot.get(`/contacts/${id}`);

    if (!response) {
      return res.status(404).json({ error: "Cannot Find Contact" });
    }

    res.status(200).json({
      success: true,
      message: "Successfully Fetched Contact",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch Contact",
      error: err.response?.data || err.message,
    });
  }
}

async function handleUpdateHubspotContact(req, res) {
  try {
    const { id } = req.params;

    const updatedData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
    };
    const response = await hubspot.patch(`/contacts/${id}`, {
      properties: updatedData,
    });

    res
      .status(200)
      .json({ message: "Contact Updated Successfully", data: response.data });
  } catch (err) {
    res.status(500).json({
      message: "Failed to Update contact",
      error: err.response?.data || err.message,
    });
  }
}

async function handleDeleteHubspotContact(req, res) {
  try {
    const { id } = req.params;

    await hubspot.delete(`/contacts/${id}`);

    res
      .status(200)
      .json({ success: true, message: "Contact Deleted Successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete contact",
      error: err.response?.data || err.message,
    });
  }
}

async function handleHubSpotDeal(req, res) {
  const { dealName, amount, stage, pipeline, contactId } = req.body;

  try {
    // Step 1: Create the Deal
    const dealResponse = await hubspot.post("/deals", {
      properties: {
        dealname: dealName,
        amount: amount,
        dealstage: stage,
        pipeline: pipeline,
      },
    });

    const dealId = dealResponse.data.id;

    // Step 2: Associate the Deal with a Contact
    await hubspot.put(
      `/deals/${dealId}/associations/contact/${contactId}/deal_to_contact`
    );

    res.status(200).json({
      message: "Deal created and associated with contact",
      deal: dealResponse.data,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create deal" });
  }
}

async function handleGetHubspotDeal(req, res) {
  try {
    const { id } = req.params;
    const response = await hubspot.get(`/deals/${id}`);

    if (!response) {
      return res.status(404).json({ error: "Cannot Find Deal" });
    }

    res.status(200).json({
      success: true,
      message: "Successfully Fetched Deal",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch Deal",
      error: err.response?.data || err.message,
    });
  }
}

async function handleUpdateHubspotDeal(req, res) {
  try {
    const { id } = req.params;
    const { dealName, amount, stage, pipeline } = req.body;

    const updatedData = {};

    if (dealName) updatedData.dealname = dealName;
    if (amount) updatedData.amount = amount;
    updatedData.dealstage = stage || "appointmentscheduled";
    updatedData.pipeline = pipeline || "default";

    const response = await hubspot.patch(`/deals/${id}`, {
      properties: updatedData,
    });

    res.status(200).json({
      message: "Deal Updated Successfully",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to Update Deal",
      error: err.response?.data || err.message,
    });
  }
}

async function handleDeleteHubspotDeal(req, res) {
  try {
    const { id } = req.params;

    await hubspot.delete(`/deals/${id}`);

    res
      .status(200)
      .json({ success: true, message: "Deal Deleted Successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete Deal",
      error: err.response?.data || err.message,
    });
  }
}

module.exports = {
  handleHubSpotContact,
  handleGetHubspotContact,
  handleUpdateHubspotContact,
  handleDeleteHubspotContact,
  handleHubSpotDeal,
  handleGetHubspotDeal,
  handleUpdateHubspotDeal,
  handleDeleteHubspotDeal,
};
