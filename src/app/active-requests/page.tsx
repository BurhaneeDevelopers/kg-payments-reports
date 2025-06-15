"use client";
import Container from "@/components/constants/layout/Container";
import { DataTable } from "@/components/data-table";
import { toast } from "sonner";
import { useGetAllActiveRequests } from "@/api-service/request-service";
import { columns } from "@/lib/request-columns";
import { Request } from "@/supabase/schema/requestSchema";

export default function ActiveRequests() {
  const {
    data: requests = [],
    isLoading: requestsLoading,
    error: requestError,
  } = useGetAllActiveRequests();

  if (requestError) toast.error("Error fetching requests");

  if (requestsLoading) return <p>Loading...</p>;
  return (
    <Container>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <DataTable<Request> data={requests} columns={columns} />
          </div>
        </div>
      </div>
    </Container>
  );
}
