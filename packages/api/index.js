import { router } from "../utils/trpc.js";
import { listAllItemsRouter } from "./routes/listAllItemsRouter.js";
import { submissionRouter } from "./routes/submission.js";

export const appRouter = router({
  submission: submissionRouter,
  list: listAllItemsRouter,
});
