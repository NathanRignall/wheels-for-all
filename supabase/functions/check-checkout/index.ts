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

type Checkout = {
  equipment: Equipment[];
  products: Product[];
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

    return new Response("done", { headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
