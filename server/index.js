const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
require("dotenv").config();

const { connectTomongoDB } = require("./connect");
const { connectToSalesforce } = require("./salesforce");

const app = express();
const server = http.createServer(app);

const salesforce = require("./routes/salesforce");

const freshSalesLead = require("./routes/freshsales");

const hubSpot = require("./routes/hubSpot");

const pipeDrive = require("./routes/pipedrive");

const epsoCrm = require("./routes/epsoCRM");

const zoho = require("./routes/zoho");

connectTomongoDB(process.env.mongodb_connection)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

connectToSalesforce()
  .then(() => {
    console.log("Salesforce connected");
  })
  .catch((err) => {
    console.error(" Failed to connect to Salesforce:", err.message);
    process.exit(1);
  });

const corsOptions = {
  origin: ["http://localhost:3000"],
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/salesforce", salesforce);
app.use("/freshsales", freshSalesLead);
app.use("/hubspot", hubSpot);
app.use("/pipedrive", pipeDrive);
app.use("/epsocrm", epsoCrm);
app.use("/zoho", zoho);

const PORT = process.env.PORT || 8000;
server.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
