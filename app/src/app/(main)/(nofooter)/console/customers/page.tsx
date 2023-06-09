import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";
import { AddCustomerModal } from "./AddCustomerModal";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Customers() {
  const supabase = createServerClient();

  const { data: _customers } = await supabase
    .from("customers")
    .select(
      `
      id,
      email,
      given_name,
      family_name,
      address_line_1,
      address_line_2,
      city,
      postcode,
      country,
      orders (
        id
      )
      `
    );

  const customers = getArray(_customers).map((customer) => ({
    ...customer,
    orders: getArray(customer.orders).length,
  }));

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Customers
      </h1>

      <section className="mt-4">
        <AddCustomerModal />

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
                  Address
                </th>
                <th scope="col" className="px-4 py-4">
                  Orders
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200 dark:divide-slate-600">
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    {`${customer.given_name} ${customer.family_name}`}
                  </th>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300">
                    {customer.email}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300">
                    {`${customer.address_line_1} ${customer.address_line_2} ${customer.city} ${customer.postcode} ${customer.country}`}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300">
                    {customer.orders}
                  </td>

                  <td className="px-4 text-right whitespace-nowrap">
                    <Link href={`/console/customers/${customer.id}`} className="text-sm text-blue-600 hover:underline">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
