import "server-only";

import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { Navbar } from "@/components/client";

// do not cache this layout
export const revalidate = 0;

// layout
export default async function BareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <>
      <Navbar loggedIn={user != null} />
      {children}
    </>
  );
}
