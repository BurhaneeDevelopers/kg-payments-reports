import { usersService } from "@/supabase/services/userService";
import { AuthUser } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
    return useQuery<AuthUser | null>({
        queryKey: ["auth", "user"],
        queryFn: usersService.getCurrentUser,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};