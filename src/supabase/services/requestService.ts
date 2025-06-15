import { supabase } from "../client";
import { Request } from "../schema/requestSchema";

export type NewRequestPayload = {
    zone: string;
    department: string;
    request_date: string;
    agency_id: string;
    agency_name: string;
    requirement_desc: string;
    labour_type: string;
    created_by: string;
    shift_type: string;
    staff_required: string | number;
    approval_status: string;
    status: string;
};

export type UpdateRequestStatusPayload = {
    approval_status: string;
    status: string;
    request_id: string
    approved_by: string
};

class Request_Service {
    private table = "requests";

    async getRequestsBasedOnUser(user_id: string | number): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('created_by', user_id)
            .or('approval_status.eq.pending, approval_status.eq.sent_to_approval')

        if (error) throw error;
        return data;
    }

    async getRejectedRequestsBasedOnUser(user_id: string | number): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('created_by', user_id)
            .or('approval_status.eq.rejected')

        if (error) throw error;
        return data;
    }

    async getApprovedRequestsBasedOnUser(user_id: string | number): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('created_by', user_id)
            .or('approval_status.eq.approved')

        if (error) throw error;
        return data;
    }

    async getRejectedRequestsBasedOnAgency(user_id: string | number): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('agency_id', user_id)
            .or('approval_status.eq.rejected')

        if (error) throw error;
        return data;
    }

    async getApprovedRequestsBasedOnAgency(user_id: string | number): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('agency_id', user_id)
            .or('approval_status.eq.approved')

        if (error) throw error;
        return data;
    }

    async getAllActiveRequestsByAgency(user_id: string): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            // .or(`agency_id.eq.${user_id}, approval_status.eq.pending, approval_status.eq.sent_to_approval`)
            .eq('agency_id', user_id)
            .or('approval_status.eq.pending, approval_status.eq.sent_to_approval')

        if (error) throw error;
        return data;
    }

    async getAllActiveRequests(): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .or('approval_status.eq.pending, approval_status.eq.sent_to_approval')

        if (error) throw error;
        return data;
    }

    async getAllApprovedRequests(): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq("approval_status", "approved")

        if (error) throw error;
        return data;
    }
    async getAllRejectedRequests(): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq("approval_status", "rejected")

        if (error) throw error;
        return data;
    }

    async createNewRequest({
        zone,
        department,
        request_date,
        agency_id,
        agency_name,
        requirement_desc,
        labour_type,
        created_by,
        shift_type,
        staff_required,
        approval_status,
        status,
    }: NewRequestPayload): Promise<Request[] | null> {

        const requestToInsert = {
            zone,
            department,
            request_date,
            agency_id,
            agency_name,
            requirement_desc,
            labour_type,
            created_by,
            shift_type,
            staff_required,
            approval_status,
            status,
        }

        const { data, error } = await supabase.from(this.table)
            .insert(requestToInsert)
            .select('*')

        if (error) throw error;
        return data;
    }

    async updateRequestStatus({
        approval_status,
        status,
        request_id,
        approved_by
    }: UpdateRequestStatusPayload): Promise<Request[] | null> {

        const requestToUpdate = {
            approval_status,
            status,
            approved_by
        }

        const { data, error } = await supabase.from(this.table)
            .update(requestToUpdate)
            .eq("id", request_id)
            .select('*')

        if (error) throw error;
        return data;
    }
}

export const
    requestService = new Request_Service();