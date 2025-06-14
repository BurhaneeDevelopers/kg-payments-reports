// Type representing a agency record from the database
export interface Request {
    id: string; // uuid
    created_at: string; // uuid
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
}