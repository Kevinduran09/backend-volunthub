import { pubsub } from "./index.js";

export const TAREA_COMPLETADA = "TAREA_COMPLETADA";
export const EVENTO_CAMBIO_ESTADO = "EVENTO_CAMBIO_ESTADO";
export const EVENTO_PROXIMO = "EVENTO_PROXIMO";

export const eventoSubscriptions = {
    Subscription: {
        tareaCompletada: {
            subscribe: () => pubsub.asyncIterator([TAREA_COMPLETADA]),
        },
        cambioEstadoEvento: {
            subscribe: () => pubsub.asyncIterator([EVENTO_CAMBIO_ESTADO]),
        },
        eventoProximoComenzar: {
            subscribe: () => pubsub.asyncIterator([EVENTO_PROXIMO]),
        },
    },
};