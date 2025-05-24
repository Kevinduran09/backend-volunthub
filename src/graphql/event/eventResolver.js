import * as eventService from "../../services/eventService.js";

export const eventResolver = {
  Query: {
    eventos: () => {
      const events = eventService.getEvents()
      return events
    },
    evento: (root, { id }) => eventService.getEventById(id),
  },
  Evento:{
    ubicacion:(root)=>{
      return{
        latitud:root.latitud,
        longitud:root.longitud
      }
    }
  }
  
};
