import * as taskService from "../../services/taskServices.js";

export const taskResolver = {
  Query: {
    getTareasPorEvento: async (_, { eventoId }) => {
      const tareas = await taskService.getTareasPorEvento(eventoId);
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
