"use client";
import { IconCash } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Agency } from "@/supabase/schema/agencySchema";
import { Wallet } from "lucide-react";
import { useGetPendingPayment } from "@/api-service/shift-services";

export function AgencyCard({
  agency,
  switchAgency,
}: {
  agency: Agency;
  switchAgency: (agencyId: string) => void;
}) {
  const { data: payment, isLoading } = useGetPendingPayment(agency.id);

  return (
    <Card
      key={agency.id}
      className="flex-grow cursor-pointer"
      onClick={() => switchAgency(agency.id)}
    >
      <CardHeader>
        <CardDescription>Agency Info</CardDescription>
        <CardTitle className="text-3xl font-bold uppercase tabular-nums @[250px]/card:text-3xl">
          {agency.agency_name}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconCash />₹{agency.cost_per_shift}/person
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Payment Pending <Wallet className="size-4 mt-1" />
        </div>
        <div className="text-2xl font-mono font-bold">
          ₹{isLoading ? "calculating..." : payment ?? 0}
        </div>
      </CardFooter>
    </Card>
  );
}
