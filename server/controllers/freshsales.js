// freshsales.js
const axios = require("axios");
require("dotenv").config();

// Create a persistent Axios instance
const freshsalesAPI = axios.create({
  baseURL: `https://${process.env.FRESHSALES_DOMAIN}/api`,
  headers: {
    Authorization: `Token token=${process.env.FRESHSALES_API_KEY}`,
    "Content-Type": "application/json",
  },
});

async function handleCreateFreshSalesLead(req, res) {
  try {
    const lead = req.body;

    if (!lead.email) {
      return res.status(400).json({ error: "Email is required." });
    }

    const response = await freshsalesAPI.post("/contacts", lead);

    res.status(201).json({ message: "Lead created", data: response.data });
  } catch (error) {
    res.status(500).json({
      error: "Failed to create lead",
      details: error.response?.data || error.message,
    });
  }
}

module.exports = { handleCreateFreshSalesLead };
