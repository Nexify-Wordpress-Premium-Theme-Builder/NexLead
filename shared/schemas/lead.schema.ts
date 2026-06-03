export const leadSchemaPlaceholder = {
  companyName: { minLength: 1, maxLength: 200 },
  website: { format: "url" },
  opportunityScore: { min: 0, max: 100 },
} as const;
