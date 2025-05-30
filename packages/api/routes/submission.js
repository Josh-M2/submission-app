import { z } from "zod";
import { router, procedure } from "../../utils/trpc.js";
import { prismaContext as prisma } from "../../utils/prisma.js";
import { TRPCError } from "@trpc/server";
import { rateLimit } from "../../utils/rateLimiter.js";

export const submissionRouter = router({
  submit: procedure
    .input(z.object({ content: z.string().min(1).max(255) }))
    .mutation(async ({ input, ctx }) => {
      const ip = ctx.req?.ip || "anonymous";
      const allowed = rateLimit(ip, 5, 60_000);

      if (!allowed) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Rate limit exceeded. Try again later.",
        });
      }

      try {
        const submission = await prisma.submission.create({
          data: { content: input.content },
        });
        return submission;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create submission",
          cause: error,
        });
      }
    }),
});
