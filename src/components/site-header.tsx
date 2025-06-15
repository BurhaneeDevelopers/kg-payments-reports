import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { AddAgency } from "./constants/AddAgency";
import { AddShift } from "./constants/AddShift";
import { ModeToggle } from "./theme/ModeToggle";
import { currentUserAtom } from "@/jotai/store";
import { useAtomValue } from "jotai";
import { AddRequest } from "./constants/AddRequest";

export function SiteHeader() {
  const currentUser = useAtomValue(currentUserAtom);
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium capitalize">
          {currentUser &&
            currentUser.role &&
            `Logged In as - ${currentUser.role} ${
              currentUser.role === "department"
                ? currentUser.department_code
                : currentUser.role === "agency"
                ? currentUser.agency_code
                : ""
            }`}
        </h1>

        <div className="ml-auto flex items-center gap-4">
          <ModeToggle />
          <AddAgency />
          <AddShift />
          <AddRequest />
        </div>
      </div>
    </header>
  );
}
