import * as taskService from "../../services/taskServices.js";

export const taskResolver = {
  Query: {
    getTareasPorEvento: async (_, { eventoId }) => {
      const tareas = await taskService.getTareasPorEvento(eventoId);
      return tareas;
    },
  },
  Mutation: {
    completarTarea: async (_, { idTarea, idUsuario },{userId}) => {
      const id = userId || idUsuario
      const tarea = await taskService.completarTarea(idTarea, id);
      return tarea;
    },
  },
};
