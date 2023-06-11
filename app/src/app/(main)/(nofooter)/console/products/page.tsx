import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";
import { AddProductModal } from "./AddProductModal";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Products() {
  const supabase = createServerClient();

  const { data: _products } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      description,
      price,
      stock
      `
    );

  const products = getArray(_products);

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Products
      </h1>

      <section className="mt-4">
        <AddProductModal />

        <div className="mt-4 border-2 rounded-lg overflow-hidden border-slate-200 dark:border-slate-600">
          <table className="w-full text-left divide-y-2 divide-slate-200 dark:divide-slate-600">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:text-slate-200 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-4">
                  Name
                </th>
                <th scope="col" className="px-4 py-4">
                  Description
                </th>
                <th scope="col" className="px-4 py-4">
                  Price
                </th>
                <th scope="col" className="px-4 py-4">
                  Stock
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
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    {product.name}
                  </th>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300">
                    {product.description}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300">
                    £{product.price / 100}
                  </td>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300">
                    {product.stock}
                  </td>

                  <td className="px-4 text-right whitespace-nowrap">
                    <Tag text="Test" variant="green" />
                  </td>

                  <td className="px-4 text-right whitespace-nowrap">
                    <Link href={`/console/products/${product.id}`} className="text-sm text-blue-600 hover:underline">
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
