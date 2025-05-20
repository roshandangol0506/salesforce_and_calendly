const axios = require("axios");

const apiUrl = "https://roshan-dangol.espocloud.com/api/v1";
const apiKey = "e75bb0c9f3006a3962bf7a34905daeed";

async function handleEpsoCrmContact(req, res) {
  try {
    const contactData = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      emailAddress: req.body.emailAddress,
      phoneNumber: req.body.phoneNumber,
    };

    const response = await axios.post(`${apiUrl}/Contact`, contactData, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
    });

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

    const response = await axios.post(`${apiUrl}/Account`, accountData, {
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": apiKey,
      },
    });

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
