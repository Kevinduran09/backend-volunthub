import { supabase } from "../config/supabaseClient.js";

export async function getEvents() {
  const { data, error } = await supabase.rpc("get_eventos_latlng");
  if (error) return new Error(error.message);
  return data;
}

export async function getEventById(idEvent) {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("id", idEvent)
    .single();
  if (error) return new Error(error.message);

  return data;
}

export async function getEventsByCategory(category) {
  const { data, error } = await supabase
    .from("eventos")
    .select("*")
    .eq("categoria", category);
  if (error) return new Error(error.message);

  return data;
}

export async function name(params) {}
