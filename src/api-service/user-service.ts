import { User } from "@/supabase/schema/userSchema";
import { usersService } from "@/supabase/services/userService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type NewUserPayload = {
    id: string
    username: string;
    password: string;
    agency_code: string;
    name: string;
    role: string;
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

export const useCreateMultipleRequirements = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: NewUserPayload) => {
            const {
                id,
                username,
                password,
                agency_code,
                name,
                role,
            } = payload;

            const responses = await usersService.createUser({
                id,
                username,
                password,
                agency_code,
                name,
                role,
            })

            return responses;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["users"] });
        },
    });
};