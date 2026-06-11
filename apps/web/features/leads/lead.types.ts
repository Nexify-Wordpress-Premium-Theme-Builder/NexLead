import type { Tables, TablesInsert, TablesUpdate } from "@nexlead/types";

export type LeadRow = Tables<"leads">;
export type LeadInsert = TablesInsert<"leads">;
export type LeadUpdate = TablesUpdate<"leads">;
export type LeadStatus = LeadRow["status"];

export type LeadMetadata = {
  website?: string | null;
  normalized_domain?: string | null;
  country?: string | null;
  city?: string | null;
  contact_title?: string | null;
  linkedin_url?: string | null;
};

export type PrimaryContact = {
  name: string | null;
  email: string | null;
  phone: string | null;
  title: string | null;
  linkedinUrl: string | null;
};

export type LeadWithPrimaryContact = LeadRow & {
  primaryContact: PrimaryContact;
  normalizedDomain: string | null;
  displayLocation: string | null;
};

export type LeadFormInput = {
  companyName: string;
  website?: string;
  industry?: string;
  country?: string;
  city?: string;
  notes?: string;
  contactName?: string;
  contactTitle?: string;
  contactEmail?: string;
  contactPhone?: string;
  linkedinUrl?: string;
};

export type CreateLeadPayload = {
  lead: LeadInsert;
};

export type LeadActionState = {
  error?: string;
  success?: string;
};
