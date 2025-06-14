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
    shift_type: string;
    staff_required: string | number;
    approval_status: string;
    status: string;
};

class Request_Service {
    private table = "requests";

    async getRequestsBasedOnAgency(agency_id: string | number): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('agency_id', agency_id)

        if (error) throw error;
        return data;
    }

    async getAllActiveRequests(): Promise<Request[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq("approval_status", "pending")

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
}

export const
    requestService = new Request_Service();