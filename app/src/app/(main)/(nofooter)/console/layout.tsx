import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { notFound } from "next/navigation";
import { getSingle } from "@/lib/supabase-type-convert";

// do not cache this page
export const revalidate = 0;

const Links = [
  { href: "/", text: "Dashboard", active: false },
  { href: "/orders", text: "Orders", active: false },
  { href: "/customers", text: "Customers", active: false },
  { href: "/products", text: "Products", active: false },
  { href: "/equipment", text: "Equipment", active: false },
  { href: "/settings", text: "Settings", active: false },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  return (
    <div className="flex h-full">
      <aside className="flex-none w-64 h-full">
        <div className="flex flex-col overflow-y-auto border-r-2 h-full bg-white border-slate-200 dark:bg-slate-800 dark:border-slate-600">
          <h2 className="text-lg font-bold px-7 py-6 border-b-2 text-slate-900 border-slate-200 dark:text-white dark:border-slate-600">
            Employee Console
          </h2>

          <ul className=" px-3 py-4 space-y-2 dark:border-slate-600">
            {Links.map((link) => (
              <li key={link.href}>
                <Link
                  className={`px-4 py-3 block rounded-lg text-lg text-slate-900 dark:text-white "${
                    link.active ? "bg-slate-100" : ""
                  }`}
                  href={`/console/${link.href}`}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="flex-1 py-6 px-8 overflow-x-auto">{children}</main>
    </div>
  );
}
