require("dotenv").config();
const axios = require("axios");

let tokenData = null;

async function connectToSalesforce() {
  const url = `${process.env.SF_LOGIN_URL}/services/oauth2/token`;
  const params = new URLSearchParams({
    grant_type: "password",
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    username: process.env.SF_USERNAME,
    password: process.env.SF_PASSWORD + process.env.SF_TOKEN,
  });

  const response = await axios.post(url, params);
  tokenData = response.data;
}

function getTokenData() {
  if (!tokenData) {
    throw new Error(
      "Salesforce not connected. Call connectToSalesforce() first."
    );
  }
  return tokenData;
}

module.exports = {
  connectToSalesforce,
  getTokenData,
};
