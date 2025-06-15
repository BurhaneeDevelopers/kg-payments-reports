"use client";
// import FilterTabs from "@/components/blocks/FilterTabs";
// import { ChartAreaInteractive } from "@/components/chart-area-interactive";
// import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

// import data from "./data.json";
import Container from "@/components/constants/layout/Container";
import { DataTable } from "@/components/data-table";
import { toast } from "sonner";
import { useGetAllShifts } from "@/api-service/shift-services";
import { useGetAllAgencies } from "@/api-service/agency-services";
import { useState } from "react";
import { columns } from "@/lib/columns";
import { Shift } from "../supabase/schema/shiftSchema";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "@/jotai/store";

export default function Home() {
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const currentUser = useAtomValue(currentUserAtom);

  const {
    data: shifts = [],
    isLoading: shiftsLoading,
    error: shiftsError,
  } = useGetAllShifts();

  const {
    data: agencies = [],
    isLoading: agenciesLoading,
    error: agenciesError,
  } = useGetAllAgencies();

  if (shiftsError) toast.error("Error fetching shifts");
  if (agenciesError) toast.error("Error fetching agencies");

  if (shiftsLoading || agenciesLoading) return <p>Loading...</p>;

  const filteredShifts = selectedAgencyId
    ? shifts.filter((shift) => shift.agency_id === selectedAgencyId)
    : shifts;
  return (
    <Container>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {currentUser && currentUser.role === "admin" && (
              <SectionCards
                agencies={agencies}
                switchAgency={setSelectedAgencyId}
              />
            )}
            {/* <FilterTabs /> */}
            <DataTable<Shift> data={filteredShifts} columns={columns} />
          </div>
        </div>
      </div>
    </Container>
  );
}
