import * as taskService from "../../services/taskServices.js";

export const taskResolver = {
  Query: {
    getTareasPorEvento: async (_, { eventId }) => {
      const tareas = await taskService.getTareasPorEvento(eventId);
      return tareas;
    },
  },
  Mutation: {
    completarTarea: async (_, { idTarea, idUsuario }) => {
      const tarea = await taskService.completarTarea(idTarea, idUsuario);
      return tarea;
    },
  },
};
