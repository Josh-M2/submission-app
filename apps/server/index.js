import express from "express";
import cors from "cors";
import * as trpcExpress from "@trpc/server/adapters/express";

import { createContext } from "../../packages/api/context.js";
import { appRouter } from "../../packages/api/index.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
