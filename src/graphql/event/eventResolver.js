import * as eventService from "../../services/eventService.js";

export const eventResolver = {
  Query: {
    eventos: () => {
      const events = eventService.getEvents();
      return events;
    },
    evento: ({ id }) => eventService.getEventById(id),
    eventosPorCategoria: ({ categoriaId }) => {
      return eventService.getEventsByCategory(categoriaId);
    },
    eventos: (root, { busqueda }) => {
      const events = eventService.getEvents(busqueda);
      return events;
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
  },
  Mutation: {
    createEvent: async (root, { input }) => {
      const evento = await eventService.createEvent(input);
      return evento;
    },
  },
};
