import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Database } from "../db-types.ts";

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

interface Payload {
  customer: Customer;
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

    // invite customer
    const { error } = await supabaseAdminClient.auth.admin.inviteUserByEmail(
      payload.customer.email,
      {
        data: {
          given_name: payload.customer.given_name,
          family_name: payload.customer.family_name,
          address_line_1: payload.customer.address_line_1,
          address_line_2: payload.customer.address_line_2,
          city: payload.customer.city,
          postcode: payload.customer.postcode,
          country: payload.customer.country,
        },
        redirectTo: "https://wheels.nlr.app/",
      }
    );

    if (error) throw new Error(error.message);

    return new Response("done", { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
