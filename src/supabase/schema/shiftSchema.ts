// Type representing a shift record from the database
export interface Shift {
    id: string; // uuid
    created_at: string; // uuid
    shift_type: string;
    shift_date: string;
    staff_attended: string | number;
    zone: string | number;
    department: string | number;
    function: string;
    agency_id: string;
    agency_name: string;
}