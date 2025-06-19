// type role = "admin" | "department" | "agency" | "staff"

export interface User {
    id: string; // uuid
    created_at: string; // uuid
    role: string;
    name: string;
    email: string;
    username?: string;
    password: string;
    department_code?: string | null
    agency_code?: string | null
}