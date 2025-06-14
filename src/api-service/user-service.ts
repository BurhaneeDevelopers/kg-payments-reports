import { User } from "@/supabase/schema/userSchema";
import { usersService } from "@/supabase/services/userService";
import { useQuery } from "@tanstack/react-query";

export const useAuth = () => {
    return useQuery<User | null>({
        queryKey: ["auth", "user"],
        queryFn: usersService.getCurrentUser,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};