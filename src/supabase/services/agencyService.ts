import { supabase } from "../client";
import { Agency } from "../schema/agencySchema";


export type NewAgencyPayload = {
    agency_name: string;
    cost_per_shift: string;
};

class Agency_Service {
    private table = "agencies";

    async getAllAgencies(): Promise<Agency[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')

        if (error) throw error;
        return data;
    }

    async createNewAgency({
        agency_name,
        cost_per_shift,
    }: NewAgencyPayload): Promise<Agency[] | null> {

        const agencyToInsert = {
            agency_name,
            cost_per_shift,
        }

        const { data, error } = await supabase.from(this.table)
            .insert(agencyToInsert)
            .select('*')

        if (error) throw error;
        return data;
    }
}

export const agencyService = new Agency_Service();