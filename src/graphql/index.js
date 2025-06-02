import { eventResolver } from "./event/eventResolver.js";

import { userResolver } from "./user/userResolver.js";

import { taskResolver } from "./Tasks/taskResolver.js";

import { eventSubscriptions } from "../subscriptions/eventSubscriptions.js";

import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { readFileSync } from "fs";
import pkg from "glob";
const { glob } = pkg;

// Función para cargar los archivos de tipo GraphQL
const loadTypeDefs = () => {
  const files = glob.sync("src/graphql/**/*.graphql");
  return files.map(file => readFileSync(file, "utf-8"));
};

// Exportar los typeDefs combinados
export const typeDefs = mergeTypeDefs(loadTypeDefs());

// Combinar todos los resolvers

export const rootResolver = mergeResolvers([
  eventResolver,
  taskResolver,
  eventSubscriptions,
  userResolver
]);


export const rootResolver = mergeResolvers([eventResolver, taskResolver]);


