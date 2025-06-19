import { supabase } from "../client";
import { Agency } from "../schema/agencySchema";


export type NewAgencyPayload = {
    agency_name: string;
    cost_per_shift: string;
    user_id: string;
    created_by: string;
    created_by_role: string;
};

class Agency_Service {
    private table = "agencies";

    async getAllAgencies(): Promise<Agency[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')

        if (error) throw error;
        return data;
    }

    async getAgenciesBasedOnUser(user_id: string): Promise<Agency[] | null> {

        const { data, error } = await supabase.from(this.table)
            .select(`
            *,
            users!agencies_user_id_fkey (
                email,
                password
            )
            `)
            .eq("created_by", user_id)

        if (error) throw error;

        return data;
    }

    async createNewAgency({
        agency_name,
        cost_per_shift,
        user_id,
        created_by,
        created_by_role
    }: NewAgencyPayload): Promise<Agency[] | null> {

        const agencyToInsert = {
            agency_name,
            cost_per_shift,
            user_id,
            created_by,
            created_by_role
        }

        const { data, error } = await supabase.from(this.table)
            .insert(agencyToInsert)
            .select('*')

        if (error) throw error;
        return data;
    }
}

export const agencyService = new Agency_Service();