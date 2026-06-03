import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Lead } from "@shared/types/lead";

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Company</TableHead>
          <TableHead>Industry</TableHead>
          <TableHead>Score</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell>{lead.companyName}</TableCell>
            <TableCell>{lead.industry}</TableCell>
            <TableCell>{lead.opportunityScore}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
