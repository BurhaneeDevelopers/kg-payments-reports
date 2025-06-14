// hooks/useGetAllShifts.ts
import { Request } from '@/supabase/schema/requestSchema';
import { requestService } from '@/supabase/services/requestService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

type RequestInput = {
    id: string;
    staff_required: string | number // or appropriate type (e.g. number[], if it's user IDs)
};

type MultiRequestPayload = {
    requests: RequestInput[];
    request_date: string;
    zone: string;
    department: string;
    requirement_desc: string;
    agency_id: string;
    agency_name: string;
    labour_type: string
};

export const useGetAllActiveRequests = () => {
    return useQuery<Request[], Error>({
        queryKey: ['requests'],
        queryFn: async () => (await requestService.getAllActiveRequests()) ?? [],
    });
};

export const useGetRequestByAgency = (agencyId: string | number) => {
    return useQuery<Request[], Error>({
        queryKey: ['requests_by_agent', agencyId],
        queryFn: async () => (await requestService.getRequestsBasedOnAgency(agencyId)) ?? [],
        enabled: !!agencyId, // only run if agencyId is truthy
    });
};

export const useCreateMultipleRequirements = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: MultiRequestPayload) => {
            const {
                requests,
                zone,
                department,
                request_date,
                agency_id,
                agency_name,
                requirement_desc,
                labour_type,
            } = payload;

            const responses = await Promise.all(
                requests.map((s) =>
                    requestService.createNewRequest({
                        zone,
                        department,
                        request_date,
                        agency_id,
                        agency_name,
                        requirement_desc,
                        labour_type,
                        shift_type: s.id,
                        staff_required: s.staff_required,
                        approval_status: "pending",
                        status: "processing",
                    })
                )
            );

            return responses;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["requests"] });
        },
    });
};