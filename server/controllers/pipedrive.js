const axios = require("axios");
require("dotenv").config();

const pipedrive = axios.create({
  baseURL: "https://api.pipedrive.com/v1",
  params: {
    api_token: process.env.PIPEDRIVE_API_TOKEN,
  },
});

async function handlePipelineDeal(req, res) {
  try {
    const {
      title,
      value,
      currency,
      person_id,
      org_id,
      status,
      expected_close_date,
    } = req.body;

    if (!title || !value) {
      return res.status(400).json({
        error: "Missing required fields: 'title' and 'value' are required.",
      });
    }

    const response = await pipedrive.post("/deals", {
      title,
      value,
      currency: currency || "USD",
      person_id,
      org_id,
      status, // option: open/won/lost
      expected_close_date, // format: YYYY-MM-DD
    });

    res.status(200).json({ message: "Deal created", data: response.data });
  } catch (error) {
    console.error(
      "Pipedrive deal creation error:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create deal" });
  }
}

async function handleGetPipedriveDeal(req, res) {
  try {
    const { id } = req.params;

    const response = await pipedrive.get(`/deals/${id}`, {});

    res
      .status(200)
      .json({ message: "Deal obtained successfully", data: response.data });
  } catch (error) {
    res.status(500).json({ error: "Failed to get deal" });
  }
}

async function handleUpdatePipedriveDeal(req, res) {
  try {
    const { id } = req.params;

    const updateData = {
      title: req.body.title,
      value: req.body.value,
      currency: req.body.currency,
      person_id: req.body.person_id,
      org_id: req.body.org_id,
      status: req.body.status, // option: open/won/lost
      expected_close_date: req.body.expected_close_date, // format: YYYY-MM-DD
    };

    const response = await pipedrive.put(`/deals/${id}`, updateData);

    res.status(200).json({
      success: true,
      message: "Deal Updated Successfully",
      data: response.data,
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to update deal" });
  }
}

async function handleDeletePipedriveDeal(req, res) {
  try {
    const { id } = req.params;

    await pipedrive.delete(`/deals/${id}`, {});

    res
      .status(200)
      .json({ success: true, message: "Successfully Deleted Deals" });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to delete deal" });
  }
}

async function handlePipedriveContact(req, res) {
  try {
    const contactData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      org_id: req.body.org_id, // ID of the associated organization
      visible_to: req.body.visible_to, // Optional: 1 (owner), 3 (entire company), etc.
      add_time: req.body.add_time, // time of creation (ISO format) format: YYYY-MM-DD
      label: req.body.label, // tag or label for person
    };

    // Basic validation
    if (!contactData.name) {
      return res.status(400).json({ error: "Name is required" });
    }
    if (!contactData.email && !contactData.phone) {
      return res.status(400).json({
        error: "At least one contact method (email or phone) is required",
      });
    }

    const response = await pipedrive.post("/persons", contactData);

    res.status(200).json({ message: "Person created", data: response.data });
  } catch (error) {
    console.error(
      "Error creating person:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to create person" });
  }
}

async function handleGetPipedriveContact(req, res) {
  try {
    const { id } = req.params;
    const response = await pipedrive.get(`/persons/${id}`);

    res.status(200).json({
      success: true,
      message: "Person Featched Successfully",
      data: response.data,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch person" });
  }
}

async function handleUpdatePipedriveContact(req, res) {
  try {
    const { id } = req.params;
    const updatedData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      org_id: req.body.org_id, // ID of the associated organization (first create organization)
      visible_to: req.body.visible_to, // Optional: 1 (owner), 3 (entire company), etc.
      add_time: req.body.add_time, // time of creation (ISO format) format: YYYY-MM-DD
      label: req.body.label, // tag or label for person
    };

    const response = await pipedrive.put(`/persons/${id}`, updatedData);

    res.status(200).json({
      success: true,
      message: "Contact Updated Successfully",
      data: response.data,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to update contact" });
  }
}

async function handleDeletePipedriveContact(req, res) {
  try {
    const { id } = req.params;

    await pipedrive.delete(`/persons/${id}`);

    res
      .status(200)
      .json({ success: true, message: "Contact deleted Successfully" });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to deleted Contact" });
  }
}

async function handlePipedriveOrganization(req, res) {
  try {
    const orgData = {
      name: req.body.name,
      owner_id: req.body.owner_id, // optional: user ID who owns the org
      address: req.body.address, // optional: physical address
      visible_to: req.body.visible_to, // optional: 1 (Owner), 3 (Entire company), etc.
      add_time: req.body.add_time, // optional: when it was added (format: YYYY-MM-DD HH:MM:SS)
      label: req.body.label, // optional: label/tag
      // phone: req.body.phone, // optional: primary phone
      // email: req.body.email, // optional: primary email
    };

    if (!orgData.name) {
      return res.status(400).json({ error: "Organization name is required." });
    }

    // if (!orgData.phone || !orgData.email) {
    //   return res.status(400).json({
    //     error: "Missing required fields: 'phone' and 'email' are required.",
    //   });
    // }

    const response = await pipedrive.post("/organizations", orgData);

    res.status(200).json({
      success: true,
      message: "Organization Created Successfully",
      data: response.data,
    });
  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ errro: "Failed to create organization" });
  }
}

async function handleGetPipedriveOrg(req, res) {
  try {
    const { id } = req.params;

    const response = await pipedrive.get(`/organizations/${id}`);

    res.status(200).json({
      success: true,
      message: "Organization fetched Successfully",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch Organization" });
  }
}

async function handleUpdatePipedriveOrg(req, res) {
  try {
    const { id } = req.params;

    const updatedData = {
      name: req.body.name,
      owner_id: req.body.owner_id, // optional: user ID who owns the org
      address: req.body.address, // optional: physical address
      visible_to: req.body.visible_to, // optional: 1 (Owner), 3 (Entire company), etc.
      add_time: req.body.add_time, // optional: when it was added (format: YYYY-MM-DD HH:MM:SS)
      label: req.body.label, // optional: label/tag
    };

    const response = await pipedrive.put(`/organizations/${id}`, updatedData);

    res.status(200).json({
      success: true,
      message: "Organization Updated Successfully",
      data: response.data,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update Organization" });
  }
}

async function handleDeletePipedriveOrg(req, res) {
  try {
    const { id } = req.params;

    await pipedrive.delete(`/organizations/${id}`);

    res
      .status(200)
      .json({ success: true, message: "Organization deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to deleted organization" });
  }
}

const handlePipedriveProduct = async (req, res) => {
  try {
    const productData = {
      name: req.body.name,
      code: req.body.code, // optional: SKU or identifier
      unit: req.body.unit, // optional: e.g., "pcs", "kg"
      tax: req.body.tax, // optional: VAT or other tax rate
      price: req.body.price, // optional: default price
      visible_to: req.body.visible_to, // optional: 1 (owner), 3 (entire company), etc.
    };

    if (!productData.name) {
      return res.status(400).json({ error: "Product name is required." });
    }

    const response = await pipedrive.post("/products", productData);

    res.status(200).json({
      success: true,
      message: "Product created successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create product." });
  }
};

const handlePipedriveLead = async (req, res) => {
  try {
    const leadData = {
      title: req.body.title,
      person_id: req.body.person_id, // optional: link to person
      org_name: req.body.org_name, // send org name instead of org_id
      owner_id: req.body.owner_id, // optional: owner of the lead
      label_ids: req.body.label_ids, // optional
      value: req.body.value
        ? {
            amount: req.body.value,
            currency: req.body.currency || "USD",
          }
        : undefined,
    };

    if (!leadData.title) {
      return res.status(400).json({ error: "Lead title is required." });
    }

    const response = await pipedrive.post("/leads", leadData);

    res.status(200).json({
      success: true,
      message: "Lead created successfully",
      data: response.data,
    });
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to create lead." });
  }
};

module.exports = {
  handlePipelineDeal,
  handleGetPipedriveDeal,
  handleUpdatePipedriveDeal,
  handleDeletePipedriveDeal,
  handlePipedriveContact,
  handleGetPipedriveContact,
  handleUpdatePipedriveContact,
  handleDeletePipedriveContact,
  handlePipedriveOrganization,
  handleGetPipedriveOrg,
  handleUpdatePipedriveOrg,
  handleDeletePipedriveOrg,
  handlePipedriveProduct,
  handlePipedriveLead,
};
