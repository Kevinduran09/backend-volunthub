import { supabase } from "../config/supabaseClient.js";
import { pubsub } from "../subscriptions/index.js";
import { TAREA_COMPLETADA } from "../subscriptions/eventSubscriptions.js";
import { EVENTO_CAMBIO_ESTADO } from "../subscriptions/eventSubscriptions.js";

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
    .eq("id", idTarea)
    .select()
    .single();

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

  const { data: evento, error: eventoError } = await supabase
    .from("eventos")
    .select("id, titulo")
    .eq("id", data.evento_id)
    .single();

  if (eventoError) throw new Error(eventoError.message);

  await verificarEventoCompletado(evento.id, evento.titulo);

  return true;
}


export async function verificarEventoCompletado(eventoId, nombreEvento) {
  const { data, error } = await supabase
    .from("tareas")
    .select("*")
    .eq("evento_id", eventoId);

  if (error) throw new Error(error.message);

  let tareasEvento = data;

  let todasCompletadas = true;

  tareasEvento.forEach(t => {
    if (t.estado !== "completada") {
      todasCompletadas = false;
    }
  });

  if (todasCompletadas) {
    await pubsub.publish(EVENTO_CAMBIO_ESTADO, {
      cambioEstadoEvento: {
        eventoId,
        nombre: nombreEvento,
        estado: "completado",
        fecha_cambio: new Date().toISOString()
      }
    });
  }
}