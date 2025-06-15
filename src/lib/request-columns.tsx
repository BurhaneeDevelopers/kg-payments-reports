import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Request } from "@/supabase/schema/requestSchema";
import { CreateRequest } from "@/components/constants/ApproveRequest";

const columns: ColumnDef<Request>[] = [
  {
    accessorKey: "agency_name",
    header: "Agency",
    cell: ({ row }) => (
      <div className="w-fit">
        <span className="text-muted-foreground px-1.5">
          {row.original.agency_name}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "shift_type",
    header: "Shift Type",
    cell: ({ row }) => (
      <div className="w-fit">
        <span className="text-muted-foreground px-1.5">
          Shift {row.original.shift_type}{" "}
          {row.original.shift_type === "1"
            ? "6:00AM-2:00PM"
            : row.original.shift_type === "2"
            ? "2:00AM-10:00PM"
            : "10:00PM-6:00AM"}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "staff_required",
    header: "Staff Requested",
    cell: ({ row }) => (
      <div className="w-fit">
        <span className="text-muted-foreground px-1.5">
          {row.original.staff_required}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => (
      <div className="w-fit">
        <span className="text-muted-foreground px-1.5">
          {row.original.department}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "zone",
    header: "Zone",
    cell: ({ row }) => (
      <div className="w-fit">
        <span className="text-muted-foreground px-1.5">
          {row.original.zone}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "approval_status",
    header: "Approval Status",
    cell: ({ row }) => (
      <div className="w-fit">
        <Badge className="px-1.5  font-semibold capitalize">
          {row.original.approval_status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Request Status",
    cell: ({ row }) => (
      <div className="w-fit">
        <Badge className="px-1.5  font-semibold capitalize">
          {row.original.status}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "requirement_desc",
    header: "Requirement Description",
    cell: ({ row }) => (
      <div className="w-fit">
        <span className="text-muted-foreground px-1.5">
          {row.original.requirement_desc}
        </span>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Pass Request",
    cell: () => (
      <div className="w-fit">
        <CreateRequest />
      </div>
    ),
  },
];

export { columns };
