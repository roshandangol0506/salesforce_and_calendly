// zoho.js
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

let accessToken = null;

/**
 * Automatically gets a fresh access token using the refresh token
 */
async function getAccessToken() {
  if (accessToken) return accessToken;

  try {
    const data = qs.stringify({
      refresh_token: process.env.ZOHO_REFRESH_TOKEN, // Save this permanently after first auth
      client_id: process.env.ZOHO_CLIENT_ID,
      client_secret: process.env.ZOHO_CLIENT_SECRET,
      grant_type: "refresh_token",
    });

    const response = await axios.post(
      "https://accounts.zoho.com/oauth/v2/token",
      data,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    console.error(
      "Failed to refresh access token:",
      error.response?.data || error.message
    );
    throw new Error("Unable to fetch Zoho access token");
  }
}

module.exports = { getAccessToken };
