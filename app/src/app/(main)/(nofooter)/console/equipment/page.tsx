import Link from "next/link";
import { createServerClient } from "@/lib/supabase-server";
import { getArray, getSingle } from "@/lib/supabase-type-convert";
import { Tag } from "@/components/ui";
import { AddEquipmentModal } from "./AddEquipmentModal";

// do not cache this page
export const revalidate = 0;

// Page
export default async function Equipment() {
  const supabase = createServerClient();

  const { data: _equipment } = await supabase
    .from("equipment")
    .select(
      `
      id,
      equipment_type: equipment_types (
        id,
        name
      ),
      notes,
      is_available
      `
    );

  const equipment = getArray(_equipment).map((equipment) => ({
    ...equipment,
    equipment_type: getSingle(equipment.equipment_type),
  }));

  return (
    <>
      <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
        Equipment
      </h1>

      <section className="mt-4">
        <AddEquipmentModal />

        <div className="mt-4 border-2 rounded-lg overflow-hidden border-slate-200 dark:border-slate-600">
          <table className="w-full text-left divide-y-2 divide-slate-200 dark:divide-slate-600">
            <thead className="text-xs font-semibold uppercase text-slate-500 bg-slate-50 dark:text-slate-200 dark:bg-slate-700">
              <tr>
                <th scope="col" className="px-4 py-4">
                  ID
                </th>
                <th scope="col" className="px-4 py-4">
                  Type
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
              {equipment.map((equipment) => (
                <tr
                  key={equipment.id}
                  className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-900"
                >
                  <th
                    scope="row"
                    className="px-4 py-4 font-bold whitespace-nowrap text-gray-900 dark:text-white"
                  >
                    {equipment.id}
                  </th>

                  <td className="px-4 py-4 whitespace-nowrap text-slate-500 dark:text-slate-300">
                    {equipment.equipment_type.name}
                  </td>

                  <td className="px-4 text-right whitespace-nowrap">
                    <Tag text="Test" variant="green" />
                  </td>

                  <td className="px-4 text-right whitespace-nowrap">
                    <Link href={`/console/equipment/${equipment.id}`} className="text-sm text-blue-600 hover:underline">
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
