// hooks/useGetAllShifts.ts
import { Shift } from '@/supabase/schema/shiftSchema';
import { shiftService } from '@/supabase/services/shiftService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type ShiftInput = {
    id: string;
    staff_attended: string | number // or appropriate type (e.g. number[], if it's user IDs)
};

type MultiShiftPayload = {
    shifts: ShiftInput[];
    shift_date: string;
    zone: string;
    department: string;
    function: string;
    agency_id: string;
    agency_name: string;
    created_by: string;
};

export const useGetAllShifts = () => {
    return useQuery<Shift[], Error>({
        queryKey: ['shifts'],
        queryFn: async () => (await shiftService.getAllShifts()) ?? [],
    });
};

export const useGetShiftByAgency = (agencyId: string) => {
    return useQuery<Shift[], Error>({
        queryKey: ['shifts', agencyId],
        queryFn: async () => (await shiftService.getShiftBasedOnAgency(agencyId)) ?? [],
        enabled: !!agencyId, // only run if agencyId is truthy
    });
};

export const useGetShiftBasedOnUser = (user_id: string) => {
    return useQuery<Shift[], Error>({
        queryKey: ['shifts_by_user', user_id],
        queryFn: async () => (await shiftService.getShiftBasedOnUser(user_id)) ?? [],
        enabled: !!user_id, // only run if agencyId is truthy
    });
};

export const useGetPendingPayment = (agencyId: string | number) => {
    return useQuery<number | null, Error>({
        queryKey: ['pendingPayment', agencyId],
        queryFn: async () => (await shiftService.getTotalPaymentPendingBasedOnAgencyAndShifts(agencyId)) ?? null,
        enabled: !!agencyId,
    });
};

export const useCreateMultipleShifts = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: MultiShiftPayload) => {
            const {
                shifts,
                shift_date,
                zone,
                department,
                function: fn,
                agency_id,
                agency_name,
                created_by
            } = payload;

            const responses = await Promise.all(
                shifts.map((s) =>
                    shiftService.createNewShift({
                        shift_type: s.id,
                        staff_attended: s.staff_attended,
                        shift_date,
                        zone,
                        department,
                        function: fn,
                        agency_id,
                        agency_name,
                        created_by
                    })
                )
            );

            return responses;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shifts_by_user"] });
            queryClient.refetchQueries({
                predicate: (query) => query.queryKey[0] === "pendingPayment",
            });
        },
    });
};