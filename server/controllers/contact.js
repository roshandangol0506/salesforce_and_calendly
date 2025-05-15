const axios = require("axios");
const { getTokenData } = require("../salesforce");

async function handleCreateContact(req, res) {
  try {
    // token generate by salesforce
    const tokenData = getTokenData();

    const contactData = {
      FirstName: req.body.firstName,
      LastName: req.body.lastName, //Required
      Email: req.body.email,
      Phone: req.body.phone, //Required
      MobilePhone: req.body.mobilePhone,
      Fax: req.body.fax,
      Title: req.body.title,
      Department: req.body.department,
      MailingStreet: req.body.mailingStreet,
      MailingCity: req.body.mailingCity,
      MailingState: req.body.mailingState,
      MailingPostalCode: req.body.mailingPostalCode,
      MailingCountry: req.body.mailingCountry,
      OtherStreet: req.body.otherStreet,
      OtherCity: req.body.otherCity,
      OtherState: req.body.otherState,
      OtherPostalCode: req.body.otherPostalCode,
      OtherCountry: req.body.otherCountry,
      Description: req.body.description,
      LeadSource: req.body.leadSource,
      AccountId: req.body.accountId, // This links the contact to an account (id of account created in account section)
      Birthdate: req.body.birthdate, // Format: "YYYY-MM-DD" (1990-06-15)
      AssistantName: req.body.assistantName,
      AssistantPhone: req.body.assistantPhone,
      Salutation: req.body.salutation, // e.g., "Mr.", "Ms."
    };

    if (!contactData.LastName || !contactData.AccountId || !contactData.Phone) {
      console.log("Last Name, Account Id and Phone Number are required");
      res.status(404).json({
        error: "Last Name, Account Id and Phone Number are required",
      });
    }

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

    // token generate by salesforce
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

    // token generate by salesforce
    const tokenData = getTokenData();

    const updateData = {
      FirstName: req.body.firstName,
      LastName: req.body.lastName,
      Email: req.body.email,
      Phone: req.body.phone,
      MobilePhone: req.body.mobilePhone,
      Fax: req.body.fax,
      Title: req.body.title,
      Department: req.body.department,
      MailingStreet: req.body.mailingStreet,
      MailingCity: req.body.mailingCity,
      MailingState: req.body.mailingState,
      MailingPostalCode: req.body.mailingPostalCode,
      MailingCountry: req.body.mailingCountry,
      OtherStreet: req.body.otherStreet,
      OtherCity: req.body.otherCity,
      OtherState: req.body.otherState,
      OtherPostalCode: req.body.otherPostalCode,
      OtherCountry: req.body.otherCountry,
      Description: req.body.description,
      LeadSource: req.body.leadSource,
      AccountId: req.body.accountId, // This links the contact to an account (id of account created in account section)
      Birthdate: req.body.birthdate, // Format: "YYYY-MM-DD" (1990-06-15)
      AssistantName: req.body.assistantName,
      AssistantPhone: req.body.assistantPhone,
      Salutation: req.body.salutation, // e.g., "Mr.", "Ms."
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

    // token generate by salesforce
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
