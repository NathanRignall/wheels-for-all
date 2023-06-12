import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";
import { getArray, getMaybeSingle } from "../type-convert.ts";

type Equipment = {
  id: string;
  start_at: Date;
  end_at: Date;
};

type Product = {
  id: string;
  quantity: number;
};

type Checkout = {
  equipment: Equipment[];
  products: Product[];
  customerId: string;
};

interface Payload {
  checkout: Checkout;
}

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const payload: Payload = await req.json();

  try {
    // connect to supabase as admin
    const supabaseAdminClient = createClient<Database>(
      Deno.env.get("SUPABASE_URL") as string,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string
    );

    let total = 0;

    console.log(payload);

    if (payload.checkout.products.length > 0) {

      // get all the products
      const { data: _products, error: productsError } = await supabaseAdminClient
        .from("products")
        .select("*")
        .in(
          "id",
          payload.checkout.products.map((p) => p.id)
        );

      if (productsError) throw new Error(productsError.message);

      const products = getArray(_products);

      // using the products and quantities, calculate the total
      products.forEach((product) => {
        const quantity = payload.checkout.products.find(
          (p) => p.id === product.id
        )?.quantity;
        if (quantity) total += product.price * quantity;
      });

    }

    if (payload.checkout.equipment.length > 0) {

      // get all the equipment types
      const { data: equipmentTypes, error: equipmentTypesError } =
        await supabaseAdminClient
          .from("equipment_types")
          .select("*")
          .in(
            "id",
            payload.checkout.equipment.map((e) => e.id)
          );

      if (equipmentTypesError) throw new Error(equipmentTypesError.message);

      // using theb equipment types with start and end dates, calculate the total
      equipmentTypes.forEach((equipmentType) => {
        const equipment = payload.checkout.equipment.find(
          (e) => e.id === equipmentType.id
        );

        if (equipment) {
          const startDate = new Date(equipment.start_at);
          const endDate = new Date(equipment.end_at);

          // days to nearest whole number
          const days = Math.ceil(
            (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
          );

          // weeks round up
          const weeks = Math.ceil(days / 7);

          console.log(weeks, days);

          let price = 0;

          if (days < 7) {
            // price per day
            price = equipmentType.daily_price * days;
          } else {
            // price per week
            price = equipmentType.weekly_price * weeks;
          }

          total += price;

          console.log(price)

          // also add the deposit
          total += equipmentType.deposit_price;

          console.log(equipmentType.deposit_price)
        }
      });

    }

    return new Response(JSON.stringify({ total }), { headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
