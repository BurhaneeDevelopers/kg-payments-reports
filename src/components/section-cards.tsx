import { Agency } from "@/supabase/schema/agencySchema";
import { AgencyCard } from "./blocks/AgencyCard";

export function SectionCards({
  agencies,
  switchAgency,
}: {
  agencies: Agency[];
  switchAgency: (agencyId: string) => void;
}) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card !flex !flex-wrap gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 ">
      {agencies && agencies.length !== 0 ? (
        agencies.map((item) => {
          return <AgencyCard key={item.id} agency={item} switchAgency={switchAgency} />;
        })
      ) : (
        <p className="text-sm bg-gray-50 rounded-md p-4 w-full text-center items-center border border-gray-200">
          No Agency Available
        </p>
      )}
    </div>
  );
}
