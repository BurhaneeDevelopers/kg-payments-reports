// hooks/useGetAllShifts.ts
import { Request } from '@/supabase/schema/requestSchema';
import { requestService, UpdateRequestStatusPayload } from '@/supabase/services/requestService';
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
    created_by: string
};

export const useGetAllActiveRequests = () => {
    return useQuery<Request[], Error>({
        queryKey: ['requests'],
        queryFn: async () => (await requestService.getAllActiveRequests()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetAllActiveRequestsByAgency = (agency_id: string) => {
    return useQuery<Request[], Error>({
        queryKey: ['requests_by_agency'],
        queryFn: async () => (await requestService.getAllActiveRequestsByAgency(agency_id)) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetAllApprovedRequests = () => {
    return useQuery<Request[], Error>({
        queryKey: ['requests_approved'],
        queryFn: async () => (await requestService.getAllApprovedRequests()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetAllRejectedRequests = () => {
    return useQuery<Request[], Error>({
        queryKey: ['requests_rejected'],
        queryFn: async () => (await requestService.getAllRejectedRequests()) ?? [],
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetRequestBasedOnUser = (user_id: string | number) => {
    return useQuery<Request[], Error>({
        queryKey: ['requests_by_user', user_id],
        queryFn: async () => (await requestService.getRequestsBasedOnUser(user_id)) ?? [],
        enabled: !!user_id, // only run if agencyId is truthy
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetRejectedRequestBasedOnUser = (user_id: string | number) => {
    return useQuery<Request[], Error>({
        queryKey: ['requests_by_rejected_user', user_id],
        queryFn: async () => (await requestService.getRejectedRequestsBasedOnUser(user_id)) ?? [],
        enabled: !!user_id, // only run if agencyId is truthy
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetApprovedRequestBasedOnUser = (user_id: string | number) => {
    return useQuery<Request[], Error>({
        queryKey: ['requests_by_approved_user', user_id],
        queryFn: async () => (await requestService.getApprovedRequestsBasedOnUser(user_id)) ?? [],
        enabled: !!user_id, // only run if agencyId is truthy
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetRejectedRequestBasedOnAgency = (user_id: string | number) => {
    return useQuery<Request[], Error>({
        queryKey: ['requests_by_rejected_agency', user_id],
        queryFn: async () => (await requestService.getRejectedRequestsBasedOnAgency(user_id)) ?? [],
        enabled: !!user_id, // only run if agencyId is truthy
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useGetApprovedRequestBasedOnAgency = (user_id: string | number) => {
    return useQuery<Request[], Error>({
        queryKey: ['requests_by_approved_agency', user_id],
        queryFn: async () => (await requestService.getApprovedRequestsBasedOnAgency(user_id)) ?? [],
        enabled: !!user_id, // only run if agencyId is truthy
        refetchOnWindowFocus: false,  // Don't refetch on tab/window switch
        refetchOnMount: false,        // Don't refetch when component mounts again
        staleTime: 1000 * 60 * 5,
    });
};

export const useUpdateRequestStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (payload: UpdateRequestStatusPayload) => {
            const {
                approval_status,
                status,
                request_id,
                approved_by
            } = payload;

            const responses = await requestService.updateRequestStatus({
                approval_status,
                status,
                request_id,
                approved_by
            })

            return responses;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["requests"] });
        },
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
                created_by,
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
                        created_by,
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