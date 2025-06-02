import { supabase } from "../config/supabaseClient.js";
import { pubsub } from "../subscriptions/index.js";
import { TAREA_COMPLETADA } from "../subscriptions/eventSubscriptions.js";

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
  const { data, error } = await supabase
    .from("tareas")
    .update({
      estado: "completada",
      completada_por: idUsuario,
    })
    .eq("id", idTarea).select().single();

  if (error) throw new Error(error.message);

  await pubsub.publish(TAREA_COMPLETADA, {
    tareaCompletada: {
      tareaId: idTarea,
      titulo: data.titulo,
      completada_por: {
        id: idUsuario,
      },
      fecha_completado: new Date().toISOString(),
    },
  });

  return true;
}

export async function getTareasPorEvento(eventoId) {
  const { data, error } = await supabase
    .from("tareas")
    .select("*")
    .eq("evento_id", eventoId);

  if (error) throw new Error(error.message);
  
  return data;
}