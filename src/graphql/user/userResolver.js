import * as userService from "../../services/userService.js"


export const userResolver = {

    Query: {

        usuarios: (root, { busqueda }) => {
            debugger
            console.log(busqueda);
            const users = userService.getUsers(busqueda);
            return users;
        },


        usuario: async (root, { id }) => {
            return await userService.getUserById(id);
        },
    },


    Mutation: {
        createUser: async (root, { input }) => {
            const usuario = await userService.createUser(input);
            return usuario;
        },

    },

}