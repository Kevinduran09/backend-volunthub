import { verifySupabaseToken } from "../helpers/verifyToken.js";
import { supabase } from "../config/supabaseClient.js";
export async function getUserContext(req, res) {
   const token = req.headers.authorization?.split(" ")[1];
    if (!token) return { req };
  
    try {
      // Validar el token con Supabase
      const { data, error } = await supabase.auth.getUser(token);
      if (error) throw error;
    
      // Si el token es válido, devolver el ID del usuario en el contexto
      return { req, userId: data.user.id };
    } catch (error) {
      console.error("Error al validar el token:", error);
      return { req };
    }
}
