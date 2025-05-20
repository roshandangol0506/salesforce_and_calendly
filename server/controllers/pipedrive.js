const axios = require("axios");
require("dotenv").config();

const pipedrive = axios.create({
  baseURL: "https://api.pipedrive.com/v1",
  params: {
    api_token: process.env.PIPEDRIVE_API_TOKEN,
  },
});

async function handlePipelineDeal(req, res) {
  const { title, value, currency } = req.body;

  try {
    const response = await pipedrive.post("/deals", {
      title,
      value,
      currency: currency || "USD",
    });

    res.status(200).json({ message: "Deal created", data: response.data });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create deal" });
  }
}

module.exports = { handlePipelineDeal };
