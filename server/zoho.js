// zoho.js
const axios = require("axios");
const qs = require("qs");
require("dotenv").config();

let accessToken = null;
let refreshToken =
  "1000.ce369ded021206c3fa8d07ea4020e99f.36c631f5bfdb2e7cc09285f93c5e569a"; // Save this permanently after first auth

/**
 * Automatically gets a fresh access token using the refresh token
 */
async function getAccessToken() {
  if (accessToken) return accessToken;

  try {
    const data = qs.stringify({
      refresh_token: refreshToken,
      client_id: "1000.IZZTSW4YLRMURR59UY3N6PSJ84TWAY",
      client_secret: "d5416f2f2876da9562b3a1d90361fc1abc5b8e0b98",
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
