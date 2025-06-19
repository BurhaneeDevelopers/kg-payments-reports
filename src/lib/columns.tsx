// import { useSortable } from "@dnd-kit/sortable";
// import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
// import { IconGripVertical } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Shift } from "@/supabase/schema/shiftSchema";
import { EditShift } from "@/components/constants/EditShift";

// Create a separate component for the drag handle
// function DragHandle({ id }: { id: string }) {
//   const { attributes, listeners } = useSortable({
//     id,
//   });

//   return (
//     <Button
//       {...attributes}
//       {...listeners}
//       variant="ghost"
//       size="icon"
//       className="text-muted-foreground size-7 hover:bg-transparent"
//     >
//       <IconGripVertical className="text-muted-foreground size-3" />
//       <span className="sr-only">Drag to reorder</span>
//     </Button>
//   );
// }

const columns: ColumnDef<Shift>[] = [
  // {
  //   id: "drag",
  //   header: () => null,
  //   cell: ({ row }) => <DragHandle id={row.original.id} />,
  // },
  // {
  //   accessorKey: "header",
  //   header: "Header",
  //   cell: ({ row }) => {
  //     return <TableCellViewer item={row.original} />
  //   },
  //   enableHiding: false,
  // },
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
    accessorKey: "staff_attended",
    header: "Staff Attended",
    cell: ({ row }) => (
      <div className="w-fit">
        <span className="text-muted-foreground px-1.5">
          {row.original.staff_attended}
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
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.zone}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "function",
    header: "Function Name",
    cell: ({ row }) => (
      <div className="w-fit">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.function}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "action",
    header: "Actions",
    cell: ({ row }) => (
      <div className="w-fit">
        <EditShift shift_Details={row.original} />
      </div>
    ),
  },
];

export { columns };
