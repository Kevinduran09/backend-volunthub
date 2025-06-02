import { createClient } from "@supabase/supabase-js";

//const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANO_KEY;

export const supabase = createClient(
  "https://vkxopscnnxvnprxuapkg.supabase.co",
  supabaseKey
);
