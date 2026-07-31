import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";

export const prerender = false;

const supabaseAdmin = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY
);

export const POST: APIRoute = async ({ request }) => {
  try {
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Missing authorization token." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.getUser(token);

    if (userError || !userData.user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired session." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(userData.user.id);

    if (deleteError) {
      console.error("Delete account error:", deleteError);
      return new Response(
        JSON.stringify({ error: "Could not delete account. Try again." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Delete account error:", err);
    return new Response(
      JSON.stringify({ error: "Server error. Please try again." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
