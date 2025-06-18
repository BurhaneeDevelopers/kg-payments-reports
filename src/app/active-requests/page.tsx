"use client";
import Container from "@/components/constants/layout/Container";
import { DataTable } from "@/components/data-table";
import { toast } from "sonner";
import {
  useGetAllActiveRequests,
  useGetAllActiveRequestsByAgency,
  useGetRequestBasedOnUser,
} from "@/api-service/request-service";
import { columns } from "@/lib/request-columns";
import { Request } from "@/supabase/schema/requestSchema";
import { useAtomValue } from "jotai";
import { currentUserAtom } from "@/jotai/store";
import { AddRequest } from "@/components/constants/AddRequest";

export default function ActiveRequests() {
  const currentUser = useAtomValue(currentUserAtom);
  const isAdmin = currentUser && currentUser.role === "admin";
  const isAgency = currentUser && currentUser.role === "agency";

  const {
    data: requests = [],
    isLoading: requestsLoading,
    error: requestError,
  } = useGetAllActiveRequests();

  const {
    data: requests_by_agency = [],
    isLoading: requests_by_agency_loading,
    error: requests_by_agency_error,
  } = useGetAllActiveRequestsByAgency(currentUser && currentUser.id);

  const {
    data: requests_by_user = [],
    isLoading: requests_by_user_loading,
    error: requests_by_user_error,
  } = useGetRequestBasedOnUser(currentUser && currentUser.id);

  const allRequests = isAdmin
    ? requests
    : isAgency
    ? requests_by_agency
    : requests_by_user;

  // For Loading
  const requests_loading = isAdmin
    ? requestsLoading
    : isAgency
    ? requests_by_agency_loading
    : requests_by_user_loading;

  // For Error
  const requests_error = isAdmin
    ? requestError
    : isAgency
    ? requests_by_agency_error
    : requests_by_user_error;

  // Handle errors & loading
  if (requests_error) toast.error("Error fetching requests");
  return (
    <Container>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="w-fit self-end px-4">
              {currentUser && currentUser.role === "department" && (
                <AddRequest />
              )}
            </div>
            <DataTable<Request> data={allRequests} columns={columns} />
          </div>
        </div>
      </div>
    </Container>
  );
}
