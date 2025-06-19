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

type MultiShiftUpdatePayload = {
    shifts: ShiftInput[];
    shift_date: string;
    zone: string | number;
    department: string | number;
    function: string;
    agency_id: string;
    agency_name: string;
    updated_by: string;
    shift_id: string;
};

export const useGetAllShifts = () => {
    return useQuery<Shift[], Error>({
        queryKey: ['shifts'],
        queryFn: async () => (await shiftService.getAllShifts()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetShiftByAgency = (agencyId: string) => {
    return useQuery<Shift[], Error>({
        queryKey: ['shifts_by_agency', agencyId],
        queryFn: async () => (await shiftService.getShiftBasedOnAgency(agencyId)) ?? [],
        enabled: !!agencyId, // only run if agencyId is truthy
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetShiftBasedOnUser = (user_id: string) => {
    return useQuery<Shift[], Error>({
        queryKey: ['shifts_by_user', user_id],
        queryFn: async () => (await shiftService.getShiftBasedOnUser(user_id)) ?? [],
        enabled: !!user_id, // only run if agencyId is truthy
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetSingleShiftBasedOnId = (shift_id: string) => {
    return useQuery<Shift, Error>({
        queryKey: ['shift_by_Id', shift_id],
        queryFn: async () => (await shiftService.getSingleShiftBasedOnId(shift_id)) ?? null,
        enabled: !!shift_id, // only run if agencyId is truthy
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetPendingPayment = (agencyId: string | number) => {
    return useQuery<number | null, Error>({
        queryKey: ['pendingPayment', agencyId],
        queryFn: async () => (await shiftService.getTotalPaymentPendingBasedOnAgencyAndShifts(agencyId)) ?? null,
        enabled: !!agencyId,
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
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
            queryClient.invalidateQueries({ queryKey: ["shifts_by_agency"] });
            queryClient.invalidateQueries({ queryKey: ["shifts"] });
            queryClient.refetchQueries({
                predicate: (query) => query.queryKey[0] === "pendingPayment",
            });
        },
    });
};

export const useUpdateMultipleShifts = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: MultiShiftUpdatePayload) => {
            const {
                shifts,
                shift_date,
                zone,
                department,
                function: fn,
                agency_id,
                agency_name,
                updated_by,
                shift_id
            } = payload;

            const responses = await Promise.all(
                shifts.map((s) =>
                    shiftService.updateShift({
                        shift_type: s.id,
                        staff_attended: s.staff_attended,
                        shift_date,
                        zone,
                        department,
                        function: fn,
                        agency_id,
                        agency_name,
                        updated_by,
                        shift_id
                    })
                )
            );

            return responses;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["shifts_by_user"] });
            queryClient.invalidateQueries({ queryKey: ["shifts_by_agency"] });
            queryClient.invalidateQueries({ queryKey: ["shifts"] });
            queryClient.refetchQueries({
                predicate: (query) => query.queryKey[0] === "pendingPayment",
            });
        },
    });
};