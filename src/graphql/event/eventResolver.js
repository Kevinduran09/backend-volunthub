import * as eventService from "../../services/eventService.js";
import * as taskService from "../../services/taskServices.js";
import * as categoryService from "../../services/categoryService.js";
export const eventResolver = {
  Query: {
    eventos: (root, { busqueda }, { userId }) => {
      console.log('entrando');
      
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

    UsuariosInscritosAUnEvento: async (root, { idEvento }) => {
      return await eventService.getUsuariosInscritosPorEvento(idEvento);
    },
   
  },
  Evento: {
    ubicacion: async (root) => {
      const ubication = await eventService.get_ubication(root.id);
      return ubication;
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
    estaInscrito: async (root, _, { userId }) => {
      if (!userId) return false;
      return await eventService.verificarInscripcionUsuario(root.id, userId);
    },
    categoria: async (root) => {
      const categoria = await categoryService.getCategoryyId(root.categoria);
      return categoria;
    },
  },
  Mutation: {
    createEvent: async (root, { input }) => {
      const evento = await eventService.createEvent(input);
      if (input.tareas && input.tareas.length > 0) {
        await taskService.createTasksForEvent(input.tareas, evento.id);
      }

      return evento;
    },
    inscribirse: async (root, { eventoId }, { userId }) => {
      if (!userId) return false;
      console.log("eventoid", eventoId);
      console.log("user id", userId);
      return await eventService.inscribirse(eventoId, userId);
    },
    anularInscripcion:async (root,{eventoId,usuarioId},{userId})=>{
    const id = usuarioId || userId;
      return await eventService.anularInscripcion(eventoId, id);
    }
  },
};
