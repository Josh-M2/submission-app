import { submissionRouter } from "../api/routes/submission.js";
import { prismaContext as prisma } from "../utils/prisma.js";

jest.mock("../../../packages/api/utils/prisma.js", () => ({
  prisma: {
    submission: {
      create: jest.fn(),
    },
  },
}));

describe("submissionRouter", () => {
  it("creates a submission", async () => {
    const mockContent = "Hello test";
    const mockData = { id: 1, content: mockContent, createdAt: new Date() };

    prisma.submission.create.mockResolvedValue(mockData);

    const result = await submissionRouter.submit.resolve({
      ctx: {},
      input: { content: mockContent },
      type: "mutation",
      path: "submit",
    });

    expect(result.content).toBe(mockContent);
  });
});
