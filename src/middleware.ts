import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

// Type for cookies that Supabase SSR sets
type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, any>;
};

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        // FIXED: Added proper type
setAll(cookiesToSet: CookieToSet[]) {
  // Update request cookies (NO options allowed)
  cookiesToSet.forEach(({ name, value }) => {
    request.cookies.set(name, value); 
  });

  // Create fresh response
  supabaseResponse = NextResponse.next({ request });

  // Update response cookies (options allowed here)
  cookiesToSet.forEach(({ name, value, options }) => {
    supabaseResponse.cookies.set(name, value, options);
  });
}
,
      },
    },
  );

  // Skip middleware for API routes to prevent circular calls
  if (request.nextUrl.pathname.startsWith("/api/")) {
    return supabaseResponse;
  }

  const isAuthRoute =
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/sign-up";

  if (isAuthRoute) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      return NextResponse.redirect(
        new URL("/", process.env.NEXT_PUBLIC_BASE_URL),
      );
    }
  }

  const { searchParams, pathname } = new URL(request.url);

  if (!searchParams.get("noteId") && pathname === "/") {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      // Get newest note
      const { data: newestNote } = await supabase
        .from("notes")
        .select("id")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (newestNote) {
        const url = request.nextUrl.clone();
        url.searchParams.set("noteId", newestNote.id);
        return NextResponse.redirect(url);
      }

      // Otherwise create one
      const { data: newNote } = await supabase
        .from("notes")
        .insert({
          user_id: user.id,
          title: "Untitled Note",
          content: "",
        })
        .select("id")
        .single();

      if (newNote) {
        const url = request.nextUrl.clone();
        url.searchParams.set("noteId", newNote.id);
        return NextResponse.redirect(url);
      }
    }
  }

  return supabaseResponse;
}

