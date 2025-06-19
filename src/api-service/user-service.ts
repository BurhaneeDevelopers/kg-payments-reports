import { User } from "@/supabase/schema/userSchema";
import { usersService } from "@/supabase/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type NewUserPayload = {
    name: string;
    email: string;
    password: string;
    role: string;
    username: string;
    department_code: string;
    agency_code: string;
};

export const useAuth = () => {
    return useQuery<User | null>({
        queryKey: ["auth", "user"],
        queryFn: usersService.getCurrentUser,
        staleTime: Infinity,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });
};

export const useCreateNewUser = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: async (payload: NewUserPayload) => {
            return await usersService.createUser(payload)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] })
        },
    })
}