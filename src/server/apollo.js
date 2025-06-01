import { rootResolver, typeDefs } from "../graphql/index.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { createServer } from "http";

export async function startApollo(app) {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: rootResolver,
  });

  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }),
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          }
        };
      }
    }]
  });

  await server.start();
  server.applyMiddleware({ app });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const serverCleanup = useServer({ schema }, wsServer);

  return httpServer;
}