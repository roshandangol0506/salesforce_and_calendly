const axios = require("axios");
const { getTokenData } = require("../salesforce");

async function handleCreateLead(req, res) {
  try {
    const tokenData = getTokenData();

    const leadData = {
      LastName: req.body.lastName,
      Company: req.body.company,
      Email: req.body.email,
    };

    if (!leadData.LastName || !leadData.Company || !leadData.Email) {
      console.log("All fields are required");
      res.status(404).json({ error: "All fields are required" });
    }

    const leadResponse = await axios.post(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Lead`,
      leadData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, leadId: leadResponse.data.id });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create lead" });
  }
}

async function handleGetLead(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    const response = await axios.get(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Lead/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    res.json({ success: true, lead: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch lead" });
  }
}

async function handleUpdateLead(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    const updateData = {
      LastName: req.body.lastName,
      Company: req.body.company,
      Email: req.body.email,
    };

    await axios.patch(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Lead/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "Lead updated successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to update lead" });
  }
}

async function handleDeleteLead(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    await axios.delete(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Lead/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to delete lead" });
  }
}

module.exports = {
  handleCreateLead,
  handleGetLead,
  handleUpdateLead,
  handleDeleteLead,
};
