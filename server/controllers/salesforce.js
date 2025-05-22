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

async function handleGetSpecificLead(req, res) {
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

async function handleGetAllLead(req, res) {
  try {
    // token generate by salesforce
    const tokenData = getTokenData();

    const response = await axios.get(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Lead`,
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
    const updateData = req.body;

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

async function handleCreateAccount(req, res) {
  try {
    const tokenData = getTokenData();

    const accountData = {
      Name: req.body.name, // ✅ Required
      Phone: req.body.phone,
      Website: req.body.website,
      Industry: req.body.industry,
      Type: req.body.type,
      BillingStreet: req.body.billingStreet,
      BillingCity: req.body.billingCity,
      BillingState: req.body.billingState,
      BillingPostalCode: req.body.billingPostalCode,
      BillingCountry: req.body.billingCountry,
      ShippingStreet: req.body.shippingStreet,
      ShippingCity: req.body.shippingCity,
      ShippingState: req.body.shippingState,
      ShippingPostalCode: req.body.shippingPostalCode,
      ShippingCountry: req.body.shippingCountry,
      NumberOfEmployees: req.body.numberOfEmployees,
      AnnualRevenue: req.body.annualRevenue,
      Description: req.body.description,
      Fax: req.body.fax,
    };

    if (!accountData.Name) {
      res.status(404).jso({ error: "Account Name is required" });
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
      BillingStreet: req.body.billingStreet,
      BillingCity: req.body.billingCity,
      BillingState: req.body.billingState,
      BillingPostalCode: req.body.billingPostalCode,
      BillingCountry: req.body.billingCountry,
      ShippingStreet: req.body.shippingStreet,
      ShippingCity: req.body.shippingCity,
      ShippingState: req.body.shippingState,
      ShippingPostalCode: req.body.shippingPostalCode,
      ShippingCountry: req.body.shippingCountry,
      NumberOfEmployees: req.body.numberOfEmployees,
      AnnualRevenue: req.body.annualRevenue,
      Description: req.body.description,
      Fax: req.body.fax,
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

async function handleCreateEvent(req, res) {
  try {
    const tokenData = getTokenData();

    const eventData = {
      Subject: req.body.subject, // ✅ Required
      StartDateTime: req.body.startDateTime, // ✅ Required (if using EndDateTime) Eg: 2025-05-15T10:00:00Z
      EndDateTime: req.body.endDateTime, // ✅ Required (if using StartDateTime) Eg: 2025-05-15T11:00:00Z
      Description: req.body.description,
      Location: req.body.location,
      WhoId: req.body.whoId, // Link to Contact or Lead (if you use lead id then leave whatid) (if use contact if must include whatid as account id)
      WhatId: req.body.whatId, // Link to Account, Opportunity, etc.
      ActivityDateTime: req.body.activityDateTime, // Use if Start/EndDateTime not used
      DurationInMinutes: req.body.durationInMinutes, // Optional (used if EndDateTime is not provided)
      OwnerId: req.body.ownerId, // User who owns the event (userid)
      ShowAs: req.body.showAs, // e.g., "Busy", "Free"
      IsAllDayEvent: req.body.isAllDayEvent, // true/false
      IsPrivate: req.body.isPrivate, // true/false
      IsReminderSet: req.body.isReminderSet, // true/false
      ReminderDateTime: req.body.reminderDateTime, // Timestamp
      Priority: req.body.priority, // e.g., "High", "Normal", "Low"
      RecurrenceStartDateTime: req.body.recurrenceStartDateTime,
      RecurrenceEndDateOnly: req.body.recurrenceEndDateOnly,
      RecurrenceTimeZoneSidKey: req.body.recurrenceTimeZoneSidKey,
      RecurrenceType: req.body.recurrenceType, // "RecursDaily", "RecursWeekly", etc.
      RecurrenceInterval: req.body.recurrenceInterval, // number (e.g., every 2 weeks)
    };

    if (
      !eventData.Subject ||
      !eventData.StartDateTime ||
      !eventData.EndDateTime
    ) {
      return res
        .status(400)
        .json({ error: "Subject, Start and end Date are required" });
    }

    const response = await axios.post(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Event`,
      eventData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, event: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to create event" });
  }
}

async function handlegetEvent(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    const response = await axios.get(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Event/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    res.json({ success: true, event: response.data });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch Event" });
  }
}

async function handleUpdateEvent(req, res) {
  try {
    const { id } = req.params;
    const tokenData = getTokenData();

    const updateData = {
      Subject: req.body.subject,
      StartDateTime: req.body.startDateTime, //  Eg: 2025-05-15T10:00:00Z
      EndDateTime: req.body.endDateTime, // Eg: 2025-05-15T11:00:00Z
      Description: req.body.description,
      Location: req.body.location,
      WhoId: req.body.whoId, // Link to Contact or Lead (if you use lead id then leave whatid) (if use contact if must include whatid as account id)
      WhatId: req.body.whatId, // Link to Account, Opportunity, etc.
      ActivityDateTime: req.body.activityDateTime, // Use if Start/EndDateTime not used
      DurationInMinutes: req.body.durationInMinutes, // Optional (used if EndDateTime is not provided)
      OwnerId: req.body.ownerId, // User who owns the event (userid)
      ShowAs: req.body.showAs, // e.g., "Busy", "Free"
      IsAllDayEvent: req.body.isAllDayEvent, // true/false
      IsPrivate: req.body.isPrivate, // true/false
      IsReminderSet: req.body.isReminderSet, // true/false
      ReminderDateTime: req.body.reminderDateTime, // Timestamp
      Priority: req.body.priority, // e.g., "High", "Normal", "Low"
      RecurrenceStartDateTime: req.body.recurrenceStartDateTime,
      RecurrenceEndDateOnly: req.body.recurrenceEndDateOnly,
      RecurrenceTimeZoneSidKey: req.body.recurrenceTimeZoneSidKey,
      RecurrenceType: req.body.recurrenceType, // "RecursDaily", "RecursWeekly", etc.
      RecurrenceInterval: req.body.recurrenceInterval, // number (e.g., every 2 weeks)
    };

    await axios.patch(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Event/${id}`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json({ success: true, message: "Event updated successfully" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to update Event" });
  }
}

async function handleDeleteEvent(req, res) {
  try {
    const { id } = req.params;

    const tokenData = getTokenData();

    await axios.delete(
      `${tokenData.instance_url}/services/data/v58.0/sobjects/Event/${id}`,
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    res.json({ success: true, message: "Successfully deleted Event" });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to delete Event" });
  }
}

module.exports = {
  handleCreateLead,
  handleGetAllLead,
  handleGetSpecificLead,
  handleUpdateLead,
  handleDeleteLead,
  handleCreateAccount,
  handleGetAccount,
  handleUpdateAccount,
  handleDeleteAccount,
  handleCreateContact,
  handleGetContact,
  handleUpdateContact,
  handleDeleteContact,
  handleCreateEvent,
  handlegetEvent,
  handleUpdateEvent,
  handleDeleteEvent,
};
