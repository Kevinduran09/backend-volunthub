import { supabase } from "../config/supabaseClient.js";



export async function getUserById(idUser) {
    const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", idUser)
        .single();
    if (error) return new Error(error.message);


    return data;
}

export async function getUsers(busqueda) {
    const { data, error } = await supabase.from("usuarios").select("*");


    if (error) return new Error(error.message);
    return data;
}

export async function getEventosInscritosPorUsuario(idUsuario) {
  
  const { data: inscripciones, error: errorInscripciones } = await supabase
    .from("inscripciones")
    .select("id_evento")
    .eq("id_usuario", idUsuario);

  if (errorInscripciones) throw new Error(errorInscripciones.message);

  if (!inscripciones || inscripciones.length === 0) {
    return [];
  }

  const idsEventos = inscripciones.map((insc) => insc.id_evento);
  const { data: eventos, error: errorEventos } = await supabase
    .from("eventos")
    .select("*")
    .in("id", idsEventos);

  if (errorEventos) throw new Error(errorEventos.message);

  return eventos;
}

export async function createUser(input) {
    const { data, error } = await supabase
        .from("usuarios")
        .insert([
            {

                nombre: input.nombre,
                correo: input.correo,
                contrasena: input.contrasena,

            },

        ]).select("id,nombre,correo,contrasena").single();
    if (error) return new Error(error.message);
    return data;
}

export async function updateUser(id, input) {
    const { data, error } = await supabase
        .from("usuarios")
        .update(input)
        .eq("id", id)
        .select("id, nombre, correo, contrasena")
        .single();

    if (error) return new Error(error.message);
    return data;
}

export async function deleteUser(id) {
  const { data, error } = await supabase
    .from("usuarios")
    .delete()
    .eq("id", id)
    .select("id, nombre, correo")
    .single();

  if (error) return new Error(error.message);
  return data;
}

