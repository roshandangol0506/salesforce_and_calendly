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

module.exports = { handleHubSpotContact };
