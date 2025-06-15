import { Agency } from '@/supabase/schema/agencySchema';
import { agencyService, NewAgencyPayload } from '@/supabase/services/agencyService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllAgencies = () => {
    return useQuery<Agency[], Error>({
        queryKey: ['agencies'],
        queryFn: async () => (await agencyService.getAllAgencies()) ?? [],
    });
};

export const useGetAgenciesBasedOnUser = (user_id: string) => {
    return useQuery<Agency[], Error>({
        queryKey: ['agencies_by_user'],
        queryFn: async () => (await agencyService.getAgenciesBasedOnUser(user_id)) ?? [],
    });
};

export const useCreateAgency = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: NewAgencyPayload) => agencyService.createNewAgency(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies_by_user'] });
        },
    });
};