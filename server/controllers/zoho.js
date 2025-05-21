const axios = require("axios");
const qs = require("qs");
const { getAccessToken } = require("../zoho");

// this below is url that must paste in browser in order to get refresh token for only one time
// https://accounts.zoho.com/oauth/v2/auth?response_type=code&client_id=1000.IZZTSW4YLRMURR59UY3N6PSJ84TWAY&redirect_uri=http://localhost:8000/oauth/callback&scope=ZohoCRM.modules.ALL&access_type=offline&prompt=consent

// This below is redirect url function which is added in zoho api console as localhost:8000/oauth/callback
// async function getZohoAccessToken(req, res) {
//   const code = req.query.code;

//   if (!code) {
//     return res.status(400).send("No code provided in query.");
//   }

//   console.log("Code is:", code);

//   try {
//     const data = qs.stringify({
//       code,
//       client_id: "1000.IZZTSW4YLRMURR59UY3N6PSJ84TWAY",
//       client_secret: "d5416f2f2876da9562b3a1d90361fc1abc5b8e0b98",
//       redirect_uri: "http://localhost:8000/oauth/callback",
//       grant_type: "authorization_code",
//     });

//     const response = await axios.post(
//       "https://accounts.zoho.com/oauth/v2/token",
//       data,
//       {
//         headers: {
//           "Content-Type": "application/x-www-form-urlencoded",
//         },
//       }
//     );

//     console.log("Full Zoho Token Response:", response.data);

//     res.json({
//       success: true,
//       message: "Successfully received token",
//       accessToken: response.data.access_token,
//       refreshToken: response.data.refresh_token,
//     });
//   } catch (error) {
//     console.error(
//       "Zoho token exchange failed:",
//       error.response?.data || error.message
//     );
//     res.status(500).json({ error: "Failed to get tokens from Zoho." });
//   }
// }

async function createZohoLead(req, res) {
  try {
    const leadData = {
      First_Name: req.body.firstName || "",
      Last_Name: req.body.lastName,
      Company: req.body.company,
      Email: req.body.email || "",
      Phone: req.body.phone || "",
    };

    // Validate required fields
    if (!leadData.Last_Name || !leadData.First_Name) {
      return res.status(400).json({
        error: "Last Name and Company are required fields in Zoho CRM.",
      });
    }

    const token = await getAccessToken();

    const response = await axios.post(
      "https://www.zohoapis.com/crm/v2/Leads",
      {
        data: [leadData],
        trigger: ["approval", "workflow", "blueprint"],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Successfully created Lead",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error creating Zoho Lead:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Failed to create Zoho Lead." });
  }
}

async function handleGetZohoLead(req, res) {
  try {
    const { id } = req.params;

    const token = await getAccessToken();

    const response = await axios.get(
      `https://www.zohoapis.com/crm/v2/Leads/${id}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Lead Fetched Successfully",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to Fetch Lead" });
  }
}

async function handleUpdateZohoLead(req, res) {
  try {
    const { id } = req.params;

    const updatedData = {
      First_Name: req.body.firstName || "",
      Last_Name: req.body.lastName,
      Company: req.body.company,
      Email: req.body.email || "",
      Phone: req.body.phone || "",
    };

    const token = await getAccessToken();

    const response = await axios.patch(
      `https://www.zohoapis.com/crm/v2/Leads/${id}`,
      {
        data: [updatedData],
        trigger: ["approval", "workflow", "blueprint"],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Lead Updated Successfully",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to Update Lead",
      error: err.response?.data || err.message,
    });
  }
}

async function handleDeleteZohoLead(req, res) {
  try {
    const { id } = req.params;

    const token = await getAccessToken();

    await axios.delete(`https://www.zohoapis.com/crm/v2/Leads/${id}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Lead Deleted Successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete Lead",
      error: err.response?.data || err.message,
    });
  }
}

async function createZohoAccount(req, res) {
  try {
    const accountData = {
      Account_Name: req.body.accountName,
      Phone: req.body.phone || "",
      Website: req.body.website || "",
      Description: req.body.description || "",
    };

    // Validate required field
    if (!accountData.Account_Name) {
      return res.status(400).json({
        error: "Account Name is required.",
      });
    }

    const token = await getAccessToken();

    const response = await axios.post(
      "https://www.zohoapis.com/crm/v2/Accounts",
      {
        data: [accountData],
        trigger: ["approval", "workflow", "blueprint"],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Account created Successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(
      "Error creating Zoho Account:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Failed to create Zoho Account." });
  }
}

async function handleGetZohoAccount(req, res) {
  try {
    const { id } = req.params;

    const token = await getAccessToken();

    const response = await axios.get(
      `https://www.zohoapis.com/crm/v2/Accounts/${id}`,
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Account Fetched Successfully",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to Fetch Account" });
  }
}

async function handleUpdateZohoAccount(req, res) {
  try {
    const { id } = req.params;

    const updatedData = {
      Account_Name: req.body.accountName,
      Phone: req.body.phone || "",
      Website: req.body.website || "",
      Description: req.body.description || "",
    };

    const token = await getAccessToken();

    const response = await axios.patch(
      `https://www.zohoapis.com/crm/v2/Accounts/${id}`,
      {
        data: [updatedData],
        trigger: ["approval", "workflow", "blueprint"],
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Account Updated Successfully",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to Update Account",
      error: err.response?.data || err.message,
    });
  }
}

async function handleDeleteZohoAccount(req, res) {
  try {
    const { id } = req.params;

    const token = await getAccessToken();

    await axios.delete(`https://www.zohoapis.com/crm/v2/Accounts/${id}`, {
      headers: {
        Authorization: `Zoho-oauthtoken ${token}`,
        "Content-Type": "application/json",
      },
    });

    res
      .status(200)
      .json({ success: true, message: "Account Deleted Successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete Account",
      error: err.response?.data || err.message,
    });
  }
}

module.exports = {
  createZohoLead,
  createZohoAccount,
  handleGetZohoLead,
  handleUpdateZohoLead,
  handleDeleteZohoLead,
  handleGetZohoAccount,
  handleUpdateZohoAccount,
  handleDeleteZohoAccount,
};
