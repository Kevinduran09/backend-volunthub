import * as taskService from "../../services/taskServices.js";

export const taskResolver = {
  Mutation: {
    completarTarea: async (_, { idTarea, idUsuario }) => {
      const tarea = await taskService.completarTarea(idTarea, idUsuario);
      return tarea;
    },
  },
};
