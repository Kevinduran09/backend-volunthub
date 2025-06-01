import { supabase } from "../config/supabaseClient.js";

export async function getEvents() {
  const { data, error } = await supabase.rpc("get_eventos_latlng");
  if (error) return new Error(error.message);
  return data;
}

export async function getEvents(busqueda) {
  const { data, error } = await supabase.rpc("get_eventos", {
    search_term: busqueda,
  });

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
export async function getEventosCercanos(lat, lon, radio = 5000) {
  const { data, error } = await supabase.rpc("get_events_nearby", {
    p_lon: lon,
    p_lat: lat,
    p_radius_m: radio,
  });
  console.log(error);
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

export async function getParticipantes(idEvent) {
  const { data, error } = await supabase
    .from("inscripciones")
    .select("*")
    .eq("id_evento", idEvent);
  if (error) return new Error(error.message);
  return data;
}
export async function searchEventsByTitle(searchTerm) {
  const { data, error } = await supabase.rpc("get_eventos", {
    search_term: searchTerm,
  });

  if (error) return new Error(error.message);
  return data;
}

export async function getCantdadInscritos(idEvent) {
  const { count, error } = await supabase
    .from("inscripciones")
    .select("id_evento", { count: "exact", head: true })
    .eq("id_evento", idEvent);
  if (error) return new Error(error.message);
  return count;
}
export async function createEvent(input) {
  const { data, error } = await supabase
    .from("eventos")
    .insert([
      {
        titulo: input.titulo,
        descripcion: input.descripcion,
        fecha: input.fecha,
        hora_inicio: input.hora_inicio,
        zona: input.zona,
        direccion: input.direccion,
        ubicacion: `SRID=4326;POINT(${input.ubicacion.longitud} ${input.ubicacion.latitud})`,
        requiere_voluntarios: input.requiere_voluntarios,
        image_url: input.image_url ?? "",
        cantidad_participantes_requeridos:
          input.cantidad_participantes_requeridos,
        categoria: 1,
        materiales_requeridos: input.materiales_requeridos ?? "",
        habilidades_requeridas: input.habilidades_opcionales ?? "",
        requisitos_adicionales: input.habilidades_requeridas ?? "",
      },
    ])
    .select("id,titulo,descripcion,fecha,hora_inicio,zona,requiere_voluntarios")
    .single();

  if (error) return new Error(error.message);
  return data;
}
