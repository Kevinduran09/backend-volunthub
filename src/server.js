import { createServer } from "http";
import { startExpress } from "./server/express.js";
import { startApollo } from "./server/apollo.js";
import pc from "picocolors";
const PORT = process.env.PORT || 9001;

async function startServer() {
    const app = startExpress()
    await startApollo(app)

    const server = createServer(app)
    server.listen(PORT, () => {
        console.log(pc.magenta(`GraphQL disponible en http://localhost:${PORT}/graphql`))
        console.log(pc.blue(`Servidor corriendo en http://localhost:${PORT}`))
    })
}

startServer()
