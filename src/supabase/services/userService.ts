// services/users.service.ts
import { AuthUser, Session, SupabaseClient } from "@supabase/supabase-js";
import { supabase } from "../client";
import { User } from "../schema/userSchema";

class UsersService {
    private table = "users";
    private client: SupabaseClient = supabase;

    async getCurrentUser(): Promise<AuthUser | null> {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        return user;
    }

    async getSession(): Promise<Session | null> {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    }

    // ✅ Create a new user
    async createUser(userData: User): Promise<AuthUser | null> {
        const { email, password, name, department_code, agency_code } = userData;

        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (signUpError) throw signUpError;

        // Optionally insert additional profile data
        const { user } = signUpData;

        if (user) {
            const { error: insertError } = await supabase
                .from(this.table)
                .insert({
                    id: user.id,
                    name,
                    email: email,
                    password: password,
                    department_code: department_code || null,
                    agency_code: agency_code || null,
                })

            if (insertError) throw insertError;
        }

        return signUpData.user;
    }

    // ✅ Login user
    async loginUser(email: string, password: string): Promise<Session | null> {
        const { data: signInData, error: signInError } = await this.client.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) throw signInError;

        return signInData.session;
    }

    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        return this.client.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }

    async signOut(): Promise<void> {
        const { error } = await this.client.auth.signOut();
        if (error) throw error;
    }
}

export const usersService = new UsersService();