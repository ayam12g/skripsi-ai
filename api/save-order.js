import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { package, price, status } = req.body;

  const { error } = await supabase.from("orders").insert([
    {
      package,
      price,
      status,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }

  return res.status(200).json({ success: true });
}
