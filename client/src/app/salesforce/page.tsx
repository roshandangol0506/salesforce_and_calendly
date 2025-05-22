"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from "axios";
import Link from "next/link";
import { Trash2, Pencil, RefreshCw, UserPlus, Phone, Mail } from "lucide-react";
import { toast } from "sonner";

interface Lead {
  Id: string;
  Name: string;
  Company?: string;
  Email?: string;
  Phone?: string;
  Status?: string;
  Industry?: string;
  attributes: {
    type: string;
    url: string;
  };
}

const leadSources = [
  "Web",
  "Phone Inquiry",
  "Partner Referral",
  "Purchased List",
  "Other",
];
const leadStatuses = [
  "Open - Not Contacted",
  "Working - Contacted",
  "Closed - Converted",
  "Closed - Not Converted",
];
const industries = [
  "Banking",
  "Healthcare",
  "Insurance",
  "Manufacturing",
  "Retail",
  "Technology",
  "Other",
];
const ratings = ["Hot", "Warm", "Cold"];

const Page = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const fetchLeads = async () => {
    setRefreshing(true);
    try {
      const response = await fetch("http://localhost:8000/salesforce/lead");
      const data = await response.json();
      if (data.success) {
        setLeads(data.lead.recentItems as Lead[]);
      }
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast("Failed to fetch leads. Please try again.");
    } finally {
      setRefreshing(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8000/salesforce/lead",
        formData
      );

      toast("Lead created successfully!");

      // Reset form
      setFormData({
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

      // Refresh leads list
      fetchLeads();
    } catch (error: any) {
      console.error(
        "Error creating lead:",
        error.response?.data || error.message
      );
      toast("Failed to create lead. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      await axios.delete(`http://localhost:8000/salesforce/lead/${id}`);
      toast("Lead deleted successfully!");
      // Remove from state
      setLeads(leads.filter((lead) => lead.Id !== id));
    } catch (error: any) {
      console.error(
        "Error deleting lead:",
        error.response?.data || error.message
      );
      toast("Failed to delete lead. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Salesforce CRM
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your leads and customer relationships
          </p>
        </div>
        <Button
          variant="outline"
          className="mt-4 md:mt-0 flex items-center gap-2"
          onClick={fetchLeads}
          disabled={refreshing}
        >
          <RefreshCw
            className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
          />
          Refresh Data
        </Button>
      </div>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="leads">Leads List</TabsTrigger>
          <TabsTrigger value="create">Create Lead</TabsTrigger>
        </TabsList>

        <TabsContent value="leads" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Lead Management
              </CardTitle>
              <CardDescription>
                View, update, and manage your sales leads
              </CardDescription>
            </CardHeader>
            <CardContent>
              {leads.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No leads found. Create your first lead to get started.
                  </p>
                </div>
              ) : (
                <ScrollArea className="h-[500px] w-full rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead className="hidden md:table-cell">
                          Company
                        </TableHead>
                        <TableHead className="hidden md:table-cell">
                          Contact
                        </TableHead>
                        <TableHead className="hidden lg:table-cell">
                          Status
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {leads.map((lead) => (
                        <TableRow key={lead.Id}>
                          <TableCell className="font-medium">
                            {lead.Name}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            {lead.Company || "—"}
                          </TableCell>
                          <TableCell className="hidden md:table-cell">
                            <div className="flex flex-col gap-1">
                              {lead.Email && (
                                <span className="flex items-center gap-1 text-xs">
                                  <Mail className="h-3 w-3" /> {lead.Email}
                                </span>
                              )}
                              {lead.Phone && (
                                <span className="flex items-center gap-1 text-xs">
                                  <Phone className="h-3 w-3" /> {lead.Phone}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {lead.Status ? (
                              <Badge
                                variant={
                                  lead.Status.includes("Closed")
                                    ? lead.Status.includes("Converted")
                                      ? "success"
                                      : "destructive"
                                    : "default"
                                }
                              >
                                {lead.Status}
                              </Badge>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Link href={`/salesforce/${lead.Id}`}>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 w-8 p-0"
                                >
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Button>
                              </Link>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                                onClick={() => handleDelete(lead.Id)}
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Create New Lead
              </CardTitle>
              <CardDescription>
                Enter the details to create a new sales lead
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent>
                <div className="grid gap-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter first name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter last name"
                        required
                      />
                    </div>
                  </div>

                  <Separator />
                  <h3 className="text-lg font-medium">Company Information</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Enter company name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title</Label>
                      <Input
                        id="title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Enter job title"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Select
                        value={formData.industry}
                        onValueChange={(value) =>
                          handleSelectChange("industry", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((industry) => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="Enter website URL"
                      />
                    </div>
                  </div>

                  <Separator />
                  <h3 className="text-lg font-medium">Contact Information</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter email address"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <Separator />
                  <h3 className="text-lg font-medium">Address</h3>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="street">Street</Label>
                      <Input
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                        placeholder="Enter street address"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="Enter city"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="state">State/Province</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="Enter state/province"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        placeholder="Enter postal code"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country">Country</Label>
                      <Input
                        id="country"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        placeholder="Enter country"
                      />
                    </div>
                  </div>

                  <Separator />
                  <h3 className="text-lg font-medium">Lead Details</h3>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="leadSource">Lead Source</Label>
                      <Select
                        value={formData.leadSource}
                        onValueChange={(value) =>
                          handleSelectChange("leadSource", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select lead source" />
                        </SelectTrigger>
                        <SelectContent>
                          {leadSources.map((source) => (
                            <SelectItem key={source} value={source}>
                              {source}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleSelectChange("status", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {leadStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rating">Rating</Label>
                      <Select
                        value={formData.rating}
                        onValueChange={(value) =>
                          handleSelectChange("rating", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                          {ratings.map((rating) => (
                            <SelectItem key={rating} value={rating}>
                              {rating}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Enter additional details about this lead"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => {
                    setFormData({
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
                  }}
                >
                  Reset
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Lead"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
