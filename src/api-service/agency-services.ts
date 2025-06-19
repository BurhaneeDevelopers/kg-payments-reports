import { Agency } from '@/supabase/schema/agencySchema';
import { agencyService, NewAgencyPayload } from '@/supabase/services/agencyService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllAgencies = () => {
    return useQuery<Agency[], Error>({
        queryKey: ['agencies'],
        queryFn: async () => (await agencyService.getAllAgencies()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetAgenciesBasedOnUser = (user_id: string) => {
    return useQuery<Agency[], Error>({
        queryKey: ['agencies_by_user'],
        queryFn: async () => (await agencyService.getAgenciesBasedOnUser(user_id)) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateAgency = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: NewAgencyPayload) => agencyService.createNewAgency(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies_by_user'] });
            queryClient.invalidateQueries({ queryKey: ['agencies'] });
        },
    });
};