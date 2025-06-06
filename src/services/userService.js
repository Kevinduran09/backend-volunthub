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

