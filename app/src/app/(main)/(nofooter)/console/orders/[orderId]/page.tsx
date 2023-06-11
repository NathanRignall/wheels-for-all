import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";
import { notFound } from "next/navigation";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Productions({
  params,
}: {
  params: { orderId: string };
}) {
  const supabase = createServerClient();

  console.log(params.orderId);

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
        id,
        equipment: equipment (
          id,
          equipment_type: equipment_types (
            id,
            name
          )
        )
      ),
      purchases: purchases (
        id,
        quantity,
        product: products (
          id,
          name
        )
      ),
      inserted_at
      `
    ).match({ id: params.orderId }).single();

  console.log(_orders);

  if (!_orders) notFound();

  const order = {
    id: _orders.id,
    customer: getSingle(_orders.customer),
    is_online: _orders.is_online,
    hires: getArray(_orders.hires).map((hire) => {
      let equipment = getSingle(hire.equipment);
      return {
        id: hire.id,
        equipment: {
          id: equipment.id,
          equipment_type: getSingle(equipment.equipment_type),
        },
      };
    }),
    purchases: getArray(_orders.purchases).map((purchase) => {
      return {
        id: purchase.id,
        quantity: purchase.quantity,
        product: getSingle(purchase.product),
      };
    }),
    inserted_at: _orders.inserted_at,
  };

  return (
    <>
      <h1 className="flex items-center text-4xl font-bold mb-3 text-slate-900 dark:text-white">
        <Link href={`/console/orders`}>
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
        Orders
      </h1>

      <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white italic">
        {order.id}
      </h2>

      <section className="mt-4">
        <div className="mt-4 border-2 rounded-lg overflow-hidden border-slate-200 dark:border-slate-600">
          <table className="w-full text-left divide-y-2 divide-slate-200 dark:divide-slate-600">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:text-slate-200 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-4">
                  ID
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Type
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200 dark:divide-slate-600">
              {order.hires.map((hire) => (
                <tr
                  key={hire.id}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    {hire.equipment.id}
                  </th>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300 text-right">
                    {hire.equipment.equipment_type.name}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-4">
        <div className="mt-4 border-2 rounded-lg overflow-hidden border-slate-200 dark:border-slate-600">
          <table className="w-full text-left divide-y-2 divide-slate-200 dark:divide-slate-600">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:text-slate-200 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4 text-right">
                  Quantity
                </th>
              </tr>
            </thead>

            <tbody className="divide-y-2 divide-solid divide-slate-200 dark:divide-slate-600">

              {order.purchases.map((purchase) => (
                <tr
                  key={purchase.id}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    {purchase.product.name}
                  </th>

                  <td className="px-4 py-4 whitespace-nowrap text-right text-slate-500 dark:text-slate-300">
                    {purchase.quantity}
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
