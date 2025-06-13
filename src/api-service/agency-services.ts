import { Agency } from '@/supabase/schema/agencySchema';
import { agencyService, NewAgencyPayload } from '@/supabase/services/agencyService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllAgencies = () => {
    return useQuery<Agency[], Error>({
        queryKey: ['agencies'],
        queryFn: async () => (await agencyService.getAllAgencies()) ?? [],
    });
};

export const useCreateAgency = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: NewAgencyPayload) => agencyService.createNewAgency(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['agencies'] });
        },
    });
};