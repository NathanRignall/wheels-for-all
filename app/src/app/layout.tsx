import "server-only";

import "./globals.css";
import { createServerClient } from "@/lib/supabase-server";
import { SupabaseListener, SupabaseProvider } from "@/components/client";

// do not cache this layout
export const revalidate = 0;

// metadata
export const metadata = {
  title: "Wheels for All",
  description: "Specialist in the hire of bikes and scooters",
};

// layout
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <html lang="en">
      <head />

      <body className="bg-slate-50 dark:bg-slate-900 h-screen flex flex-col">
        <SupabaseProvider session={session}>
          <SupabaseListener serverAccessToken={session?.access_token} />
          {children}
        </SupabaseProvider>
      </body>
    </html>
  );
}
