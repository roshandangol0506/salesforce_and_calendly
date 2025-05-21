"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";

const Page = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    email: "",
    phone: "",
    title: "",
    website: "",
    leadSource: "",
    status: "",
    industry: "",
    rating: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    description: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:8000/salesforce/lead",
        {
          // passing single fields from object and again making object in backend (pass direct an object and receive just object in backend)
          firstName: formData.firstName,
          lastName: formData.lastName,
          company: formData.company,
          email: formData.email,
          phone: formData.phone,
          title: formData.title,
          website: formData.website,
          leadSource: formData.leadSource,
          status: formData.status,
          industry: formData.industry,
          rating: formData.rating,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country,
          description: formData.description,
        }
      );

      console.log("Lead Created:", response.data);
      alert("Lead created successfully!");
    } catch (error: any) {
      console.error(
        "Error creating lead:",
        error.response?.data || error.message
      );
      alert("Failed to create lead.");
    }
  };

  return (
    <div className="">
      <p className="text-center text-4xl font-bold text-blue-300 p-4">
        Create a New Lead
      </p>
      <form onSubmit={handleSubmit} className="grid gap-4 p-4 max-w-xl mx-auto">
        {Object.entries(formData).map(([field, value]) => (
          <Input
            key={field}
            name={field}
            value={value}
            onChange={handleChange}
            placeholder={`Enter ${field}`}
            required={["firstName", "lastName", "company", "email"].includes(
              field
            )}
          />
        ))}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default Page;
