const axios = require("axios");
const { getTokenData } = require("../salesforce");

async function findLeadByEmail(email, tokenData) {
  const query = `SELECT Id, LastName, Email FROM Lead WHERE Email = '${email}' LIMIT 1`;
  const url = `${
    tokenData.instance_url
  }/services/data/v58.0/query?q=${encodeURIComponent(query)}`;

  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  return response.data.records.length > 0 ? response.data.records[0] : null;
}

async function handleCreateLead(req, res) {
  try {
    // token generate by salesforce
    const tokenData = getTokenData();

    // data of lead (firstname, lastname, company and email are required)
    const leadData = {
      FirstName: req.body.firstName, //Required
      LastName: req.body.lastName, //Required
      Company: req.body.company, //Required
      Email: req.body.email, //Required
      Phone: req.body.phone,
      Title: req.body.title,
      Website: req.body.website,
      LeadSource: req.body.leadSource,
      Status: req.body.status,
      Industry: req.body.industry,
      Rating: req.body.rating,
      Street: req.body.street,
      City: req.body.city,
      State: req.body.state,
      PostalCode: req.body.postalCode,
      Country: req.body.country,
      Description: req.body.description,
    };

    // handles required field
    if (
      !leadData.FirstName ||
      !leadData.LastName ||
      !leadData.Company ||
      !leadData.Email
    ) {
      console.log("First Name, Last Name, Company and Email are required");
      res.status(404).json({
        error: "First Name, Last Name, Company and Email are required",
      });
    }

    // Check if lead(email) already exists
    const existingLead = await findLeadByEmail(leadData.Email, tokenData);
    if (existingLead) {
      return res.status(409).json({
        error: "Lead already exists",
        lead: existingLead,
      });
    }

    // posting in lead
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

    // token generate by salesforce
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

    // token generate by salesforce
    const tokenData = getTokenData();

    // update only required field, doesnot need to insert all field data to update
    const updateData = {
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      Company: req.body.company,
      Email: req.body.email,
      Phone: req.body.phone,
      Title: req.body.title,
      Website: req.body.website,
      LeadSource: req.body.leadSource,
      Status: req.body.status,
      Industry: req.body.industry,
      Rating: req.body.rating,
      Street: req.body.street,
      City: req.body.city,
      State: req.body.state,
      PostalCode: req.body.postalCode,
      Country: req.body.country,
      Description: req.body.description,
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

    // token generate by salesforce
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
