import { supabase } from "../config/supabaseClient.js";

export async function createTasksForEvent(tasks, eventId) {
  if (!tasks || tasks.length === 0) return;

  const tasksToInsert = tasks.map((task) => ({
    titulo: task.nombre,
    estado: "pendiente", // o task.estado si lo pasás desde el input
    completada_por: null,
    evento_id: eventId,
  }));

  const { error } = await supabase.from("tareas").insert(tasksToInsert);

  if (error) throw new Error(error.message);
}

export async function completarTarea(idTarea, idUsuario) {
  const { error } = await supabase
    .from("tareas")
    .update({
      estado: "completada",
      completada_por: idUsuario,
    })
    .eq("id", idTarea);

  if (error) throw new Error(error.message);
  return true;
}
