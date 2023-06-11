import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";

type Equipment = {
  id: string;
  start_at: Date;
  end_at: Date;
};

type Product = {
  id: string;
  quantity: number;
};

type Customer = {
  email: string;
  given_name: string;
  family_name: string;
  address_line_1: string;
  address_line_2: string;
  city: string;
  postcode: string;
  country: string;
};

type Checkout = {
  equipment: Equipment[];
  products: Product[];
  customer: Customer;
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

    console.log(payload);

    // set the customer's id
    let customerId = payload.checkout.customerId;

    // check if need to invite a new customer
    if (!payload.checkout.customerId) {
      // invite customer
      const { error } = await supabaseAdminClient.auth.admin.inviteUserByEmail(
        payload.checkout.customer.email,
        {
          data: {
            given_name: payload.checkout.customer.given_name,
            family_name: payload.checkout.customer.family_name,
            address_line_1: payload.checkout.customer.address_line_1,
            address_line_2: payload.checkout.customer.address_line_2,
            city: payload.checkout.customer.city,
            postcode: payload.checkout.customer.postcode,
            country: payload.checkout.customer.country,
          },
          redirectTo: "https://wheels.nlr.app/",
        }
      );

      if (error) throw new Error(error.message);

      // get the user's id
      const { data: profile } = await supabaseAdminClient
        .from("customers")
        .select("id")
        .eq("email", payload.checkout.customer.email)
        .single();

      if (!profile) throw new Error("No customer found");

      customerId = profile.id;
    }

    // create the order
    const { data: order, error: orderError } = await supabaseAdminClient
      .from("orders")
      .insert({
        customer_id: customerId,
        is_online: false,
      })
      .select()
      .single();

    console.log({
      customer_id: customerId,
      is_online: false,
    });

    if (orderError) throw new Error(orderError.message);

    // create the order purchases
    const { error: purchasesError } = await supabaseAdminClient
      .from("purchases")
      .insert(
        payload.checkout.products.map((product) => ({
          order_id: order.id,
          product_id: product.id,
          quantity: product.quantity,
        }))
      );

    if (purchasesError) throw new Error(purchasesError.message);

    // create the order hires
    const { error: hiresError } = await supabaseAdminClient
      .from("hires")
      .insert(
        payload.checkout.equipment.map((equipment) => ({
          order_id: order.id,
          equipment_id: equipment.id,
          start_at: equipment.start_at,
          end_at: equipment.end_at,
        }))
      );

    if (hiresError) throw new Error(hiresError.message);

    return new Response("done", { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
