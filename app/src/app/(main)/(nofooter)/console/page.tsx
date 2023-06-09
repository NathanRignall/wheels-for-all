import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";
import { notFound } from "next/navigation";
import { get } from "http";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Pages({
  params,
}: {
  params: { companyId: string };
}) {
  const supabase = createServerClient();

  return (
    <>
      <h1 className="mb-3 text-5xl font-bold text-slate-900 dark:text-white">
        Dashboard
      </h1>

      <article className="mt-4">
        <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white">
          Recent Responses
        </h2>

        <div className="mt-4 border-2 rounded-lg overflow-hidden border-slate-200 dark:border-slate-600">
          <table className="w-full text-left divide-y-2 divide-slate-200 dark:divide-slate-600">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:text-slate-200 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4">
                  Email
                </th>
                <th scope="col" className="px-4 py-4">
                  Date
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Vacancy
                </th>
              </tr>
            </thead>
          </table>
        </div>
      </article>
    </>
  );
}
