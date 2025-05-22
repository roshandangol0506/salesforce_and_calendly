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
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  RefreshCw,
  UserPlus,
  Save,
  User,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

interface Lead {
  Id: string;
  FirstName: string;
  LastName: string;
  Company: string;
  Email: string;
  Phone: string;
  Title: string;
  Website: string;
  LeadSource: string;
  Status: string;
  Industry: string;
  Rating: string;
  Street: string;
  City: string;
  State: string;
  PostalCode: string;
  Country: string;
  Description: string;
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
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await axios.patch(
        `http://localhost:8000/salesforce/lead/${id}`,
        formData
      );

      toast("Lead updated successfully!");

      // Refresh lead data
      fetchLead();
    } catch (error: any) {
      console.error(
        "Error updating lead:",
        error.response?.data || error.message
      );
      toast("Failed to update lead. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const fetchLead = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:8000/salesforce/lead/${id}`
      );
      const data = await response.json();

      if (data.success) {
        const l = data.lead as Lead;
        setLead(l);

        // Pre-fill the form from fetched lead
        setFormData({
          firstName: l.FirstName || "",
          lastName: l.LastName || "",
          company: l.Company || "",
          email: l.Email || "",
          phone: l.Phone || "",
          title: l.Title || "",
          website: l.Website || "",
          leadSource: l.LeadSource || "",
          status: l.Status || "",
          industry: l.Industry || "",
          rating: l.Rating || "",
          street: l.Street || "",
          city: l.City || "",
          state: l.State || "",
          postalCode: l.PostalCode || "",
          country: l.Country || "",
          description: l.Description || "",
        });
      } else {
        toast("Failed to fetch lead details. Lead may not exist.");
        router.push("/salesforce");
      }
    } catch (error) {
      console.error("Error fetching lead:", error);
      toast("Failed to fetch lead details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLead();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/salesforce">
              <span className="flex items-center gap-1">
                <Building2 className="h-4 w-4" />
                Salesforce
              </span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/salesforce">Leads</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>
              {loading ? (
                <Skeleton className="h-4 w-24" />
              ) : (
                <span className="font-medium">
                  {lead?.FirstName} {lead?.LastName}
                </span>
              )}
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <Link href="/salesforce">
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
              <User className="h-5 w-5 text-sky-600" />
              {loading ? (
                <Skeleton className="h-8 w-48" />
              ) : (
                <>
                  {lead?.FirstName} {lead?.LastName}
                </>
              )}
            </h1>
            {!loading && lead?.Status && (
              <Badge
                variant={
                  lead.Status.includes("Closed")
                    ? lead.Status.includes("Converted")
                      ? "success"
                      : "destructive"
                    : "default"
                }
                className="mt-1"
              >
                {lead.Status}
              </Badge>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          className="mt-4 md:mt-0 flex items-center gap-2"
          onClick={fetchLead}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh Data
        </Button>
      </div>

      {loading ? (
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-72" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="h-5 w-5" />
              Update Lead
            </CardTitle>
            <CardDescription>
              Update the details for {lead?.FirstName} {lead?.LastName}
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
              <Link href="/salesforce">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  );
};

export default Page;
