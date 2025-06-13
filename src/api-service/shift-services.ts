// hooks/useGetAllShifts.ts
import { Shift } from '@/supabase/schema/shiftSchema';
import { NewShiftPayload, shiftService } from '@/supabase/services/shiftService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllShifts = () => {
    return useQuery<Shift[], Error>({
        queryKey: ['shifts'],
        queryFn: async () => (await shiftService.getAllShifts()) ?? [],
    });
};

export const useGetShiftByAgency = (agencyId: string | number) => {
    return useQuery<Shift[], Error>({
        queryKey: ['shifts', agencyId],
        queryFn: async () => (await shiftService.getShiftBasedOnAgency(agencyId)) ?? [],
        enabled: !!agencyId, // only run if agencyId is truthy
    });
};

export const useGetPendingPayment = (agencyId: string | number) => {
    return useQuery<number | null, Error>({
        queryKey: ['pendingPayment', agencyId],
        queryFn: async () => (await shiftService.getTotalPaymentPendingBasedOnAgencyAndShifts(agencyId)) ?? null,
        enabled: !!agencyId,
    });
};

export const useCreateShift = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: NewShiftPayload) => shiftService.createNewShift(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['shifts'] });
            // refetch pending payment api
            queryClient.refetchQueries({
                predicate: (query) => query.queryKey[0] === 'pendingPayment',
            });
        },
    });
};