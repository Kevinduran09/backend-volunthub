import { supabase } from "../config/supabaseClient.js";

export async function getEvents(busqueda) {
  let query = supabase.from("eventos").select("*");

  if (busqueda && busqueda.trim() !== "") {
    query = query.ilike("titulo", `%${busqueda}%`);
  }

  const { data, error } = await query;

  if (error) return new Error(error.message);
  return data;
}

export async function get_ubication(event_id) {
  const { data, error } = await supabase
    .rpc("get_ubication_to_event", {
      event_id: event_id,
    })
    .single();

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
  console.log("lat: ", lat);
  console.log("ln: ", lon);
  const { data, error } = await supabase.rpc("get_events_nearby", {
    p_lon: lon,
    p_lat: lat,
    p_radius_m: radio,
  });
  console.log(error);
  if (error) return new Error(error.message);
  return data;
}

export async function getUsuariosInscritosPorEvento(idEvento) {
  
  const { data: inscripciones, error: errorInscripciones } = await supabase
    .from("inscripciones")
    .select("id_usuario")
    .eq("id_evento", idEvento);

  if (errorInscripciones) throw new Error(errorInscripciones.message);

  if (!inscripciones || inscripciones.length === 0) {
    return [];
  }

  const idsUsuarios = inscripciones.map((insc) => insc.id_usuario);
  const { data: usuarios, error: errorUsuarios } = await supabase
    .from("usuarios")
    .select("*")
    .in("id", idsUsuarios);

  if (errorUsuarios) throw new Error(errorUsuarios.message);

  return usuarios;
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

export async function inscribirse(eventoId, userId) {
  const { data, error } = await supabase
    .from("inscripciones")
    .insert([
      {
        id_evento: eventoId,
        id_usuario: userId,
        fecha_inscripcion: new Date().toISOString(),
      },
    ])
    .select("*")
    .single();
  if (error) return new Error(error.message);

  return data;
}
export async function verificarInscripcionUsuario(eventoId, userId) {
  const { data, error } = await supabase
    .from("inscripciones")
    .select("*")
    .eq("id_evento", eventoId)
    .eq("id_usuario", userId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No se encontró el registro
      return false;
    }
    return new Error(error.message);
  }
  return !!data;
}
export async function anularInscripcion(eventoId,userId){
  const {error} = await supabase.from('inscripciones').delete().eq('id_evento',eventoId).eq('id_usuario',userId)
  return !error;
}