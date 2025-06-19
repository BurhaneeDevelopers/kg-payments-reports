import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Copy, Key } from "lucide-react";
import { toast } from "sonner";

export default function AgencyCredentials({ agency }) {
  const handleCopy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    toast.success(`${label} copied!`);
  };

  return (
    <div className="text-right space-y-2">
      <h6 className="text-xs text-muted-foreground">Login Credentials:</h6>

      <div className="flex justify-end items-center gap-2 text-sm font-semibold">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleCopy(agency?.users?.email, "Email")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Email</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <span>{agency?.users?.email}</span>
        {/* <Mail className="w-4 h-4" /> */}
      </div>

      <div className="flex justify-end items-center gap-2 text-sm font-normal">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                onClick={() => handleCopy(agency?.users?.password, "Password")}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Copy Password</TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Badge variant="outline" className="flex items-center gap-2">
          <Key className="w-4 h-4" />
          Password: {agency?.users?.password}
        </Badge>
      </div>
    </div>
  );
}
