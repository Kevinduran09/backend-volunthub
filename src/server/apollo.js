import { rootResolver, typeDefs } from "../graphql/index.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";

export async function startApollo(app) {
  const schema = makeExecutableSchema({ 
    typeDefs, 
    resolvers: rootResolver 
  });

  const server = new ApolloServer({ 
    schema,
    context: ({ req }) => ({ req })
  });

  await server.start();
  server.applyMiddleware({ app });
}
