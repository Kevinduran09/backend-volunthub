import { pubsub } from "./index.js";

export const TAREA_COMPLETADA = "TAREA_COMPLETADA";
export const EVENTO_CAMBIO_ESTADO = "EVENTO_CAMBIO_ESTADO";
export const EVENTO_PROXIMO = "EVENTO_PROXIMO";

export const eventSubscriptions = {
    Subscription: {
        tareaCompletada: {
            subscribe: (_, { userId, eventId }) => {
                const channel = `${TAREA_COMPLETADA}:${eventId}`;
                return pubsub.asyncIterator(channel);
            },
        },
        cambioEstadoEvento: {
            subscribe: (_, { userId, eventId }) => {
                const channel = `${EVENTO_CAMBIO_ESTADO}:${eventId}`;
                return pubsub.asyncIterator(channel);
            },
        },
        eventoProximoComenzar: {
            subscribe: (_, { userId, eventId }) => {
                const channel = `${EVENTO_PROXIMO}:${eventId}`;
                return pubsub.asyncIterator(channel);
            },
        },
    },
};