const sgMail = require("@sendgrid/mail");
const axios = require("axios");
require("dotenv").config();
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function handleSendGrid(req, res) {
  const { to, subject, text, html } = req.body;
  const file = req.file;

  //required if file is attached
  let base64File = null;
  let attachment = null;

  // file may be attached or not
  if (file) {
    base64File = file.buffer.toString("base64");
    attachment = [
      {
        content: base64File,
        filename: file.originalname,
        type: file.mimetype,
        disposition: "attachment",
      },
    ];
  }

  if (!text && !html) {
    return res.status(400).json({ error: "Must include text or HTML" });
  }

  const recipients = Array.isArray(to) ? to : [to]; // ensure array if sent_to is multiple it sends mail to multiple emails

  if (!recipients) {
    return res.status(400).json({ error: "Must include to whom mail is sent" });
  }

  const msg = {
    to: recipients, // can be array or single
    from: "roshan2121004@iimscollege.edu.np",
    subject,
    text,
    html,
    ...(attachment && { attachments: attachment }), //if only file is attached send file to gmail
  };

  try {
    await sgMail.send(msg);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error sending email",
      error: error.response?.body || error.message,
    });
  }
}

async function createCampaign(req, res) {
  try {
    const {
      name,
      subject,
      sender_id, //id of sender (owner)
      list_ids, //ids of receiver
      html_content,
      plain_content,
      all = false, // whether to send to all contacts (if false lit_ids is required otherwise make it true)
      custom_unsubscribe_url, // any url like https//palmmind.com
    } = req.body;

    if (!name && !subject) {
      return res.status(400).jon({ error: "Name and subject are required" });
    }

    if (!sender_id) {
      return res.status(400).json({ error: "Required Sender ID" });
    }

    if (all == false && !list_ids) {
      return res
        .status(400)
        .json({ error: "List id is required otherwise send to everyone" });
    }

    if (!custom_unsubscribe_url) {
      return res.status(400).json({ error: "Required custom unsubscribe url" });
    }

    const payload = {
      name,
      email_config: {
        subject,
        sender_id,
        html_content,
        plain_content,
        custom_unsubscribe_url,
      },
      send_to: {
        list_ids,
        all,
      },
    };

    const createResponse = await axios.post(
      "https://api.sendgrid.com/v3/marketing/singlesends",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Campaign created successfully",
      data: createResponse.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating campaign",
      error: error.response?.data || error.message,
    });
  }
}

async function schedualCampaign(req, res) {
  try {
    const { id } = req.params; //is should be of seingle sends
    const { send_at } = req.body; //it must be time 2025-05-22T09:25:00Z (YYYY-MM-DDTHH:MM:SSZ) america/chicago

    if (!send_at) {
      return res.status(400).json({ error: "Required when to send the email" });
    }

    const response = await axios.put(
      `https://api.sendgrid.com/v3/marketing/singlesends/${id}/schedule`,
      { send_at },
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Successfully scheduled campaign",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error scheduling campaign",
      error: err.response?.data || err.message,
    });
  }
}

async function createList(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const response = await axios.post(
      "https://api.sendgrid.com/v3/marketing/lists",
      { name },
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "List created successfully",
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating list",
      error: error.response?.data || error.message,
    });
  }
}

async function addContacts(req, res) {
  try {
    //if id of list is not mentioned the contact is saved in AllContact otherwise contact saves in both AllContact and list
    const { contacts, list_ids } = req.body;

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one contact is required." });
    }

    const payload =
      list_ids && Array.isArray(list_ids) && list_ids.length > 0
        ? { contacts, list_ids }
        : { contacts };

    const response = await axios.put(
      "https://api.sendgrid.com/v3/marketing/contacts",
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: list_ids
        ? "Contacts added to list(s) successfully"
        : "Contacts added to All Contacts",
      data: response.data,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding contacts",
      error: error.response?.data || error.message,
    });
  }
}

async function createTemplate(req, res) {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(404).json({ error: "Name is required" });
    }

    const response = await axios.post(
      "https://api.sendgrid.com/v3/templates",
      { name },
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      message: "Template created",
      templateId: response.data.id,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating template",
      error: error.response?.data || error.message,
    });
  }
}

async function addVersionToTemplate(req, res) {
  try {
    const payload = {
      active: req.body.active,
      name: req.body.name,
      html_content: req.body.html_content,
      plain_content: req.body.plain_content,
      subject: req.body.subject,
      editor: req.body.editor,
    };
    const templateId = req.body.templateId;

    const response = await axios.post(
      `https://api.sendgrid.com/v3/templates/${templateId}/versions`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Successfully create version in template",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create version in template",
      error: err.response?.data || err.message,
    });
  }
}

async function sendWithDynamicTemplate(req, res) {
  try {
    const { to, templateId, first_name } = req.body;

    const msg = {
      to,
      from: "roshan2121004@iimscollege.edu.np",
      templateId,
      dynamic_template_data: {
        first_name,
      },
    };

    await sgMail.send(msg);
    res
      .status(200)
      .json({ success: true, message: "Email sent using dynamic template" });
  } catch (err) {
    res.status(500).json({
      message: "Error sending email",
      error: err.response?.body || err.message,
    });
  }
}

module.exports = {
  handleSendGrid,
  createCampaign,
  schedualCampaign,
  createList,
  addContacts,
  createTemplate,
  addVersionToTemplate,
  sendWithDynamicTemplate,
};

// Send including attachemnts done
// Send to multiple recipients done
// Send emails using categories (for analytics grouping)
// Manage contact lists (segments) done
// Create/edit dynamic templates
// Assign templates to emails
