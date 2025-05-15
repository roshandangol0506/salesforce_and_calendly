const axios = require("axios");
const { getTokenData } = require("../salesforce");

async function handleCreateAccount(req, res) {
  try {
    const tokenData = getTokenData();

    const accountData = {
      Name: req.body.name,
      Phone: req.body.phone,
      Website: req.body.website,
      Industry: req.body.industry,
      Type: req.body.type,
      BillingCity: req.body.billingCity,
      BillingState: req.body.billingState,
    };

    if (
      !accountData.Name ||
      !accountData.Phone ||
      !accountData.Website ||
      !accountData.Industry ||
      !accountData.BillingCity ||
      !accountData.BillingState
    ) {
      res.status(404).jso({ error: "All fields are required" });
    }

    const response = await axios.post(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Account`,
      accountData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, accountId: response.data.id });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create account" });
  }
}

async function handleGetAccount(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();
    const response = await axios.get(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Account/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    res.json({ success: true, contact: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Account" });
  }
}

async function handleUpdateAccount(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    const updateData = {
      Name: req.body.name,
      Phone: req.body.phone,
      Website: req.body.website,
      Industry: req.body.industry,
      Type: req.body.type,
      BillingCity: req.body.billingCity,
      BillingState: req.body.billingState,
    };

    const response = await axios.patch(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Account/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "Account updated successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to Update Account" });
  }
}

async function handleDeleteAccount(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    await axios.delete(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Account/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to delete Account" });
  }
}

module.exports = {
  handleCreateAccount,
  handleGetAccount,
  handleUpdateAccount,
  handleDeleteAccount,
};
