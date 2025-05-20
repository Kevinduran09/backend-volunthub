/* eslint-disable quotes */
/* eslint-disable semi */
import { ApolloServer } from "apollo-server-express";
import { graphql } from "graphql";
import { gql } from "apollo-server-core";
import express from "express";
import { v1 as uuid } from "uuid";

import { createClient } from "@supabase/supabase-js";
import pc from "picocolors";
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANO_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
const users = [
  {
    id: "1",
    nombre: "Juan",
    apellido: "Pérez",
    edad: 28,
    ciudad: "Ciudad de México",
    direccion: "Av. Reforma 123",
  },
  {
    id: "2",
    nombre: "Ana",
    apellido: "García",
    edad: 17,
    ciudad: "Guadalajara",
    direccion: "Calle Juárez 456",
  },
  {
    id: "3",
    nombre: "Luis",
    apellido: "Martínez",
    edad: 22,
    ciudad: "Monterrey",
    direccion: "Blvd. Constitución 789",
  },
];

// Los typeDefs se encargan de definir toda la estructura de datos que va manejar nuestro servicio graphql
const typeDefs = gql`
  # Tipos Enum
  enum tieneUbicacion {
    YES
    NO
  }
  type Ubicacion {
    ciudad: String
    direccion: String
  }
  type User {
    id: ID!
    nombre: String!
    apellido: String!
    edad: Int!
    ubicacion: Ubicacion
    canDrink: Boolean
  }
  type Evento {
    id: ID!
    titulo: String!
    descripcion: String!
    fecha: String!
    horaInicio: String!
    zona: String!
    created_at: String!
    ubicacion: String!
    requiere_voluntarios: Boolean!
    image_url: String
  }
  type Query {
    users(ubicacion: tieneUbicacion): [User]
    eventos: [Evento]
  }
  type Mutation {
    addUser(
      nombre: String!
      apellido: String!
      edad: Int!
      ubicacion: ubicacionInput
    ): User
    editUser(nombre: String!, apellido: String, edad: String): User
  }
  # Los input sirven para definir la estructura de los datos de las mutaciones, no son obligatorias pero pueden ser de ayuda para datos complejos
  input ubicacionInput {
    ciudad: String
    direccion: String
  }
`;
// El resolver se va encargar de definir la logica encargada de manejar cada query y mutacion definida en el typeDefs asi como extender funcionalidades de un tipo de dato
const resolvers = {
  Query: {
    users: (root, args) => {
      if (!args.ubicacion || args.ubicacion === "NO") return users;

      return users.filter((user) => user.ciudad);
    },
    eventos: async () => {
      const { data } = await supabase.from("eventos").select("*,categorias(*)");
      console.dir(data, { depth: null });
      return data;
    },
  },
  User: {
    // Defino la manera en la cual se va manejar la informacion referente a la ubicacion | root es el objeto padre en este caso roo hace referencia a cada registro obtenido de users
    ubicacion: (root) => {
      return {
        ciudad: root.ciudad,
        direccion: root.direccion,
      };
    },
    canDrink: (root) => root.edad > 18,
  },
  Mutation: {
    addUser: (root, args) => {
      const { nombre, apellido, edad, ubicacion } = args;
      const newUser = {
        id: uuid(),
        nombre,
        apellido,
        edad,
        ciudad: ubicacion.ciudad,
        direccion: ubicacion.direccion,
      };
      users.push(newUser);
      return newUser;
    },
    editUser: (root, args) => {
      const index = users.findIndex((user) => user.nombre === args.nombre);
      if (index === -1) return null;

      const user = users[index];

      const updatedUser = { ...user, ...args };

      users[index] = updatedUser;
      return updatedUser;
    },
  },
};

async function startApolloServer() {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  server.applyMiddleware({ app });

  app.get("/api/", (req, res) => {
    res.json({
      data: "Holamundo desde la api",
    });
  });

  app.listen(4000, () => {
    console.log(pc.green("Servidor corriendo en http://localhost:4000"));
    console.log(
      pc.magenta(
        `GraphQL disponible en http://localhost:4000${server.graphqlPath}`
      )
    );
  });
}

await startApolloServer();
