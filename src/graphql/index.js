import { eventResolver } from "./event/eventResolver.js";
import { eventoSubscriptions } from "../subscriptions/eventoSubscriptions.js";
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

// Exportar los resolvers combinados
export const rootResolver = mergeResolvers([
  eventResolver,
  eventoSubscriptions
]);