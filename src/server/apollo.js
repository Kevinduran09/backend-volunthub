import { rootResolver, typeDefs } from "../graphql/index.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-express";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { createServer } from "http";
import {  getUserContext } from "../middlewares/authMiddleware.js";

export async function startApollo(app) {
  const schema = makeExecutableSchema({
    typeDefs,
    resolvers: rootResolver,
    
  });

  const httpServer = createServer(app);

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
    const context = await getUserContext(req);
    return context;
  },
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