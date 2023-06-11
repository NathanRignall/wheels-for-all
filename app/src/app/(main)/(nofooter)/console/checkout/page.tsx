import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";
import { notFound } from "next/navigation";
import { get } from "http";
import { Checkout } from "./Checkout";

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
      <h1 className="flex items-center text-4xl font-bold mb-3 text-slate-900 dark:text-white">
        <Link href={`/console`}>
          <svg
            className="h-5 w-5 mr-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={4}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </Link>
        Checkout
      </h1>

      <Checkout />
    </>
  );
}
