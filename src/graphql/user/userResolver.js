import * as userService from "../../services/userService.js";

export const userResolver = {
    Query: {
        usuario: async (root, { id }) => {
            return await userService.getUserById(id);
        },
        usuarios: (root, { busqueda }) => {
            debugger;
            console.log(busqueda);
            const users = userService.getUsers(busqueda);
            return users;
        },

        eventosInscritosPorUsuario: async (root, { idUsuario },{userId}) => {
            const id = idUsuario || userId;
            return await userService.getEventosInscritosPorUsuario(id);
        },
    },


    Mutation: {
        createUser: async (root, { input }) => {
            const usuario = await userService.createUser(input);
            return usuario;
        },
        updateUser: async (root, { id, input }) => {
            const usuarioActualizado = await userService.updateUser(id, input);
            return usuarioActualizado;
        },
        deleteUser: async (root, { id }) => {
            return await userService.deleteUser(id);
        },
    },
};
