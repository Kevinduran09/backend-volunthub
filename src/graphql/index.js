import { eventResolver } from "./event/eventResolver.js";

import { userResolver } from "./user/userResolver.js";

import { taskResolver } from "./Tasks/taskResolver.js";

import { mergeTypeDefs, mergeResolvers } from "@graphql-tools/merge";
import { readFileSync } from "fs";
import pkg from "glob";
const { glob } = pkg;

// Función para cargar todos los archivos .graphql
const loadTypeDefs = () => {
  const files = glob.sync("src/graphql/**/*.graphql");
  const typeDefs = files.map((file) => {
    const content = readFileSync(file, "utf-8");
    return content;
  });
  return typeDefs;
};

// Exportar los typeDefs combinados
export const typeDefs = mergeTypeDefs(loadTypeDefs());

// Combinar todos los resolvers

export const rootResolver = mergeResolvers([eventResolver, taskResolver]);
