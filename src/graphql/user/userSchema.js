import { readFile } from "node:fs/promises";

export const userDefs = await readFile("./userDefs.graphql", "utf-8");
