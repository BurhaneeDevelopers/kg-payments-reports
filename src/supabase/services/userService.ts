import { AuthError, Session } from "@supabase/supabase-js";
import { supabase } from "../client";
import { User } from "../schema/userSchema";
import { NewUserPayload } from '../../api-service/user-service';

class UsersService {
    private table = "users";

    async getCurrentUser(): Promise<User> {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;

        if (user) {
            const { data: currentUser, error: currentUserError } = await supabase.from(this.table)
                .select("*")
                .eq("id", user.id)
                .single()

            if (currentUserError) throw currentUserError;

            if (currentUser) {
                const userData = {
                    ...user,
                    ...currentUser
                }

                return userData;
            }
        }
    }

    async getSession(): Promise<Session | null> {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        return session;
    }

    // ✅ Create a new user
    async createUser(userData: NewUserPayload): Promise<User | null> {
        const res = await fetch('/api/create-user', {
            method: 'POST',
            body: JSON.stringify(userData),
        })

        const data = await res.json()

        if (!res.ok) {
            throw new Error(data.error || 'Failed to create user')
        }

        return data
    }

    // ✅ Login user
    async loginUser(email: string, password: string): Promise<Session | null> {
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (signInError) throw signInError;

        return signInData.session;
    }

    onAuthStateChange(callback: (event: string, session: Session | null) => void) {
        return supabase.auth.onAuthStateChange((event, session) => {
            callback(event, session);
        });
    }

    async signOut(): Promise<AuthError | void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }
}

export const usersService = new UsersService();