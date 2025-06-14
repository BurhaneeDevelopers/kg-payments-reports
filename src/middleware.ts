// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    const response = NextResponse.next();

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: (cookiesToSet) => {
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();

    // Skip redirect if no user
    if (!user) return response;

    const role = user.role;

    // Avoid infinite loop
    const currentPath = request.nextUrl.pathname;

    if (role === "admin" && currentPath === "/") {
        return NextResponse.redirect(new URL("/", request.url));
    }

    if (role !== "admin" && currentPath === "/") {
        return NextResponse.redirect(new URL("/active-requests", request.url));
    }

    return response;
}
