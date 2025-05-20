import { readFile } from "node:fs/promises";

export const eventDefs = await readFile("./eventSchema.graphql", "utf-8");
