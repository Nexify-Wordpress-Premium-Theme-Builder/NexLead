export const meetingSchemaPlaceholder = {
  title: { minLength: 1, maxLength: 200 },
  scheduledAt: { format: "date-time" },
} as const;
