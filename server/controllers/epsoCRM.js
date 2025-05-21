const axios = require("axios");
require("dotenv").config();

const apiUrl = "https://roshan-dangol.espocloud.com/api/v1";

async function handleEpsoCrmContact(req, res) {
  try {
    const contactData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      phoneNumber: req.body.phoneNumber,
    };

    const response = await axios.post(
      `${process.env.EPSOCRM_API_URL}/Contact`,
      contactData,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.EPSOCRM_API_KEY,
        },
      }
    );

    console.log("Contact created:", response.data);
    res.status(200).json({ message: "Contact created", data: response.data });
  } catch (error) {
    console.error(
      "Error creating contact:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create contact" });
  }
}

async function handleEspoCrmAccount(req, res) {
  try {
    const accountData = {
      name: req.body.name,
      emailAddress: req.body.emailAddress,
      phoneNumber: req.body.phoneNumber,
      website: req.body.website,
      billingAddressStreet: req.body.billingAddressStreet,
      billingAddressCity: req.body.billingAddressCity,
      billingAddressCountry: req.body.billingAddressCountry,
    };

    const response = await axios.post(
      `${process.env.EPSOCRM_API_URL}/Account`,
      accountData,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Api-Key": process.env.EPSOCRM_API_KEY,
        },
      }
    );

    res.json({ message: "Account created", data: response.data });
  } catch (error) {
    console.error(
      "Error creating account:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Account creation failed" });
  }
}

module.exports = { handleEpsoCrmContact, handleEspoCrmAccount };
