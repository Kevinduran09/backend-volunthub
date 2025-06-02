import { supabase } from "../config/supabaseClient";

export async function getUserById(idUser) {
    const { data, error } = await supabase
        .from("usuarios")
        .select("*")
        .eq("id", idUser)
        .single();
    if (error) return new Error(error.message);

    console.log("Usuario encontrado:", data);
    
    return data;
}

export async function getUsers(busqueda) {
  const { data, error } = await supabase.rpc("get_usuarios", {
    search_term: busqueda,
  });
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