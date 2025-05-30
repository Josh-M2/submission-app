import { z } from "zod";
import { router, procedure } from "../../utils/trpc.js";
import { TRPCError } from "@trpc/server";
import { prismaContext as prisma } from "../../utils/prisma.js";

export const listAllItemsRouter = router({
  getAll: procedure
    .input(z.object({ page: z.number().min(1).default(1) }))
    .query(async ({ input }) => {
      const itemsPerPage = 5;
      const { page } = input;

      try {
        const list = await prisma.submission.findMany({
          skip: (page - 1) * itemsPerPage,
          take: itemsPerPage,
          orderBy: { createdAt: "desc" },
        });

        const totalCount = await prisma.submission.count();

        return {
          data: list,
          totalCount,
          totalPages: Math.ceil(totalCount / itemsPerPage),
          currentPage: page,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch submissions",
          cause: error,
        });
      }
    }),
});
