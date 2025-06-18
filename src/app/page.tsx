"use client";

import Container from "@/components/constants/layout/Container";
import { DataTable } from "@/components/data-table";
import { toast } from "sonner";
import {
  useGetShiftBasedOnUser,
  useGetAllShifts,
} from "@/api-service/shift-services";
import {
  useGetAgenciesBasedOnUser,
  useGetAllAgencies,
} from "@/api-service/agency-services";
import { useEffect, useState } from "react";
import { columns } from "@/lib/columns";
import { Shift } from "../supabase/schema/shiftSchema";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "@/jotai/store";
import { SectionCards } from "@/components/section-cards";
import { useRouter } from "next/navigation";
import { AddShift } from "@/components/constants/AddShift";

export default function Home() {
  const currentUser = useAtomValue(currentUserAtom);
  const [selectedAgencyId, setSelectedAgencyId] = useState<string | null>(null);
  const isAdmin = currentUser?.role === "admin";
  const router = useRouter();

  // Always call both
  const {
    data: allShifts = [],
    // isLoading: allShiftsLoading,
    error: allShiftsError,
  } = useGetAllShifts();
  const {
    data: userShifts = [],
    // isLoading: userShiftsLoading,
    error: userShiftsError,
  } = useGetShiftBasedOnUser(currentUser?.id || "");

  const {
    data: allAgencies = [],
    // isLoading: allAgenciesLoading,
    error: allAgenciesError,
  } = useGetAllAgencies();
  const {
    data: userAgencies = [],
    // isLoading: userAgenciesLoading,
    error: userAgenciesError,
  } = useGetAgenciesBasedOnUser(currentUser?.id || "");

  useEffect(() => {
    if (currentUser && currentUser.role === "agency") {
      router.replace("/active-requests");
    }
  }, [currentUser, router]);
  if (!currentUser) return;

  // Strategic selection
  const shifts = isAdmin ? allShifts : userShifts;
  const agencies = isAdmin ? allAgencies : userAgencies;

  // For Loading
  // const shiftsLoading = isAdmin ? allShiftsLoading : userShiftsLoading;
  // const agenciesLoading = isAdmin ? allAgenciesLoading : userAgenciesLoading;

  // For Error
  const shiftsError = isAdmin ? allShiftsError : userShiftsError;
  const agenciesError = isAdmin ? allAgenciesError : userAgenciesError;

  // Handle errors & loading
  if (shiftsError) toast.error("Error fetching shifts");
  if (agenciesError) toast.error("Error fetching agencies");
  // if (shiftsLoading || agenciesLoading) return <p>Loading...</p>;

  const filteredShifts = selectedAgencyId
    ? shifts.filter((shift) => shift.agency_id === selectedAgencyId)
    : shifts;

  return (
    <Container>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards
              agencies={agencies}
              switchAgency={setSelectedAgencyId}
            />
            <div className="w-fit self-end px-4">
              {currentUser && currentUser.role !== "agency" && <AddShift />}
            </div>
            <DataTable<Shift> data={filteredShifts} columns={columns} />
          </div>
        </div>
      </div>
    </Container>
  );
}
