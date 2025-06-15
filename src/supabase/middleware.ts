// middleware.ts
import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    });
    
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        },
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const pathname = request.nextUrl.pathname;

    if (!user && pathname !== "/login") {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const role = user?.user_metadata?.role;

    // Redirect agency role from `/` to `/active-requests`
    if (pathname === "/" && role === "agency") {
        return NextResponse.redirect(new URL("/active-requests", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/dashboard", "/active-requests", "/((?!api|_next|static|favicon.ico).*)"],
};
