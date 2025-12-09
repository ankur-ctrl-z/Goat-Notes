import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Type for cookies Supabase will try to set
type CookieToSet = {
  name: string;
  value: string;
  options?: Record<string, any>;
};

export async function createClient() {
  const cookieStore = await cookies();

  const client = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        // FIX: add proper type
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.error("Error setting cookies:", error);
          }
        },
      },
    },
  );

  return client;
}

export async function getUser() {
  const { auth } = await createClient();

  const userObject = await auth.getUser();

  if (userObject.error) {
    console.error(userObject.error);
    return null;
  } 

  return userObject.data.user;
}

