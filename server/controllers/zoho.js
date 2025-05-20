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
    const { firstName, lastName, company, email, phone } = req.body;

    // Validate required fields
    if (!lastName || !company) {
      return res.status(400).json({
        error: "Last Name and Company are required fields in Zoho CRM.",
      });
    }

    const leadData = {
      First_Name: firstName || "",
      Last_Name: lastName,
      Company: company,
      Email: email || "",
      Phone: phone || "",
    };

    const token = await getAccessToken(); // assumes this gets valid token

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

    console.log("Lead created:", response.data);
    return res.json(response.data);
  } catch (error) {
    console.error(
      "Error creating Zoho Lead:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Failed to create Zoho Lead." });
  }
}

async function createZohoAccount(req, res) {
  try {
    const { accountName, phone, website, description } = req.body;

    // Validate required field
    if (!accountName) {
      return res.status(400).json({
        error: "Account Name is required.",
      });
    }

    const accountData = {
      Account_Name: accountName,
      Phone: phone || "",
      Website: website || "",
      Description: description || "",
    };

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

    console.log("Account created:", response.data);
    return res.json(response.data);
  } catch (error) {
    console.error(
      "Error creating Zoho Account:",
      error.response?.data || error.message
    );
    return res.status(500).json({ error: "Failed to create Zoho Account." });
  }
}

module.exports = { createZohoLead, createZohoAccount };
