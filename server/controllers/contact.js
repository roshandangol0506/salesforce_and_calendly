const axios = require("axios");
const { getTokenData } = require("../salesforce");

async function handleCreateContact(req, res) {
  try {
    const tokenData = getTokenData();

    const contactData = {
      LastName: req.body.lastName,
      FirstName: req.body.firstName,
      Email: req.body.email,
      Phone: req.body.phone,
      AccountId: req.body.accountId,
    };

    const response = await axios.post(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Contact`,
      contactData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, contactId: response.data.id });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create contact" });
  }
}

async function handleGetContact(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    const response = await axios.get(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Contact/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    res.json({ success: true, contact: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Contact" });
  }
}

async function handleUpdateContact(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    const updateData = {
      LastName: req.body.lastName,
      FirstName: req.body.firstName,
      Email: req.body.email,
      Phone: req.body.phone,
      AccountId: req.body.accountId,
    };

    const response = await axios.patch(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Contact/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "Contact updated successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to Update Contact" });
  }
}

async function handleDeleteContact(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    await axios.delete(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Contact/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );
    res.json({ success: true, message: "Contact deleted successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to delete Contact" });
  }
}

module.exports = {
  handleCreateContact,
  handleGetContact,
  handleUpdateContact,
  handleDeleteContact,
};
