import { supabase } from "../config/supabaseClient.js";

export async function getCategoryyId(idCategory) {
  const { data, error } = await supabase
    .from("categorias")
    .select("*")
    .eq("id", idCategory)
    .single();
  if (error) return new Error(error.message);

  return data;
}

export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categorias")
    .select("*");
  
  if (error) return new Error(error.message);
  return data;
}
