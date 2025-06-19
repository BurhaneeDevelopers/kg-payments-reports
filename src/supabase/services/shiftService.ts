import { supabase } from "../client";
import { Shift } from "../schema/shiftSchema";

export type NewShiftPayload = {
    shift_type: string;
    shift_date: string;
    staff_attended: string | number;
    zone: string | number;
    department: string | number;
    function: string;
    agency_id: string;
    agency_name: string;
    created_by: string;
};

export type UpdateShiftPayload = {
    shift_type: string;
    shift_date: string;
    staff_attended: string | number;
    zone: string | number;
    department: string | number;
    function: string;
    agency_id: string;
    agency_name: string;
    updated_by: string;
    shift_id: string
};

class Shift_Service {
    private table = "shifts";
    private agencyTable = "agencies";

    async getTotalPaymentPendingBasedOnAgencyAndShifts(
        agency_id: string | number
    ): Promise<number | null> {
        // Fetch agency data to get cost_per_shift
        const { data: agencyData, error: agencyError } = await supabase
            .from(this.agencyTable)
            .select('cost_per_shift')
            .eq('id', agency_id)
            .single();

        if (agencyError) throw agencyError;
        if (!agencyData) return null;

        const { data: shiftData, error: shiftError } = await supabase
            .from(this.table)
            .select('staff_attended')
            .eq('agency_id', agency_id);

        if (shiftError) throw shiftError;
        if (!shiftData) return null;

        // Sum all staff_attended
        const totalStaffAttended = shiftData.reduce((sum, shift) => sum + (Number(shift.staff_attended) || 0), 0);
        console.log(totalStaffAttended)
        // Calculate total cost
        const totalCost = agencyData.cost_per_shift * totalStaffAttended;
        console.log(totalCost)

        return totalCost;
    }


    async getShiftBasedOnAgency(agency_id: string): Promise<Shift[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('agency_id', agency_id)

        if (error) throw error;
        return data;
    }

    async getSingleShiftBasedOnId(shift_id: string): Promise<Shift | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('id', shift_id)
            .single()

        if (error) throw error;
        return data;
    }

    async getShiftBasedOnUser(user_id: string): Promise<Shift[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')
            .eq('created_by', user_id)

        if (error) throw error;
        return data;
    }

    async getAllShifts(): Promise<Shift[] | null> {
        const { data, error } = await supabase.from(this.table)
            .select('*')

        if (error) throw error;
        return data;
    }

    async createNewShift({
        shift_type,
        shift_date,
        staff_attended,
        zone,
        department,
        function: functionName,
        agency_id,
        agency_name,
        created_by,
    }: NewShiftPayload): Promise<Shift[] | null> {

        const shiftToInsert = {
            shift_type,
            shift_date,
            staff_attended,
            zone,
            department,
            function: functionName,
            agency_id,
            agency_name,
            created_by,
        }

        const { data, error } = await supabase.from(this.table)
            .insert(shiftToInsert)
            .select('*')

        if (error) throw error;
        return data;
    }

    async updateShift({
        shift_type,
        shift_date,
        staff_attended,
        zone,
        department,
        function: functionName,
        agency_id,
        agency_name,
        updated_by,
        shift_id
    }: UpdateShiftPayload): Promise<Shift[] | null> {
        const shiftToUpdate = {
            shift_type,
            shift_date,
            staff_attended,
            zone,
            department,
            function: functionName,
            agency_id,
            agency_name,
            updated_by,
        }

        const { data, error } = await supabase.from(this.table)
            .update(shiftToUpdate)
            .eq("id", shift_id)
            .select('*')

        if (error) throw error;
        return data;
    }
}

export const shiftService = new Shift_Service();