import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Orders({
  params,
}: {
  params: { companyId: string };
}) {
  const supabase = createServerClient();

  const { data: _orders } = await supabase
    .from("orders")
    .select(
      `
      id,
      customer: customers (
        id,
        given_name,
        family_name
      ),
      is_online,
      hires: hires (
        id
      ),
      purchases: purchases (
        id
      ),
      inserted_at
      `
    )
    .match({ company_id: params.companyId });

  const orders = getArray(_orders).map((order) => {
    return {
      id: order.id,
      customer: getSingle(order.customer),
      is_online: order.is_online,
      hires: getArray(order.hires).length,
      purchases: getArray(order.purchases).length,
      inserted_at: order.inserted_at,
    };
  });

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Orders
      </h1>

      <section className="mt-4">
        <div className="mt-4 border-2 rounded-lg overflow-hidden border-slate-200 dark:border-slate-600">
          <table className="w-full text-left divide-y-2 divide-slate-200 dark:divide-slate-600">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:text-slate-200 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4">
                  Order Date
                </th>
                <th scope="col" className="px-4 py-4">
                  Hires
                </th>
                <th scope="col" className="px-4 py-4">
                  Purchases
                </th>
                <th scope="col" className="px-4 py-4">
                  Status
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200 dark:divide-slate-600">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold whitespace-nowrap text-slate-900 dark:text-white"
                  >
                    {`${order.customer.given_name} ${order.customer.family_name}`}
                  </th>

                  <td className="px-4 py-4 max-w-sm whitespace-nowrap">
                    <p className="text-sm truncate text-slate-500 dark:text-slate-300">
                      {new Date(order.inserted_at).toLocaleDateString()}
                    </p>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      {order.hires}
                    </span>
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="text-sm text-slate-500 dark:text-slate-300">
                      {order.purchases}
                    </span>
                  </td>

                  <td className="px-4 text-right whitespace-nowrap">
                    <Tag text="Test" variant="green" />
                  </td>

                  <td className="px-4 py-4 text-right">
                    <Link href={`/console/orders/${order.id}`} className="text-sm text-blue-600 hover:underline">
                      View
                    </Link>
                    {" | "}
                    <Link href={`/console/orders/${order.id}/edit`} className="text-sm text-blue-600 hover:underline">
                      Edit
                    </Link>
                    {" | "}
                    <Link href={`/console/orders/${order.id}/delete`} className="text-sm text-blue-600 hover:underline">
                      Process
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
