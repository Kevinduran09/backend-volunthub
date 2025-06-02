import * as eventService from "../../services/eventService.js";
import * as taskService from "../../services/taskServices.js";

export const eventResolver = {
  Query: {
    eventos: (root, { busqueda }) => {
      const events = eventService.getEvents(busqueda);
      return events;
    },
    evento: (_, { id }) => {
      return eventService.getEventById(id);
    },
    eventosPorCategoria: ({ categoriaId }) => {
      return eventService.getEventsByCategory(categoriaId);
    },
    eventosCercanos: (root, { lat, lon, radio }) => {
      const events = eventService.getEventosCercanos(lat, lon, radio);
      return events;
    },
  },
  Evento: {
    ubicacion: (root) => {
      return {
        latitud: root.latitud,
        longitud: root.longitud,
      };
    },
    participantes: (root) => {
      const participantes = eventService.getParticipantes(root.id);
      return participantes;
    },
    participantes_inscritos: (root) => {
      const participantes_inscritos = eventService.getCantdadInscritos(root.id);
      return participantes_inscritos;
    },
    tareas: async (root) => {
      const tareas = await taskService.getTareasPorEvento(root.id);
      return tareas;
    },
  },
  Mutation: {
    createEvent: async (root, { input }) => {
      const evento = await eventService.createEvent(input);
      if (input.tareas && input.tareas.length > 0) {
        await taskService.createTasksForEvent(input.tareas, evento.id);
      }
      console.log(input);
      console.log(evento);
      return evento;
    },
  },
};
