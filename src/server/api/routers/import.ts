import { StudySetVisibility } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { nanoid } from "nanoid";
import { z } from "zod";
import { QUIZLET_IMPORT_REGEXP } from "../../../constants/characters";
import type { ApiStudiableItem } from "../../../interfaces/api-studiable-item";
import { createTRPCRouter, protectedProcedure } from "../trpc";

type ApiResponse = {
  responses: {
    models: { studiableItem: ApiStudiableItem[] };
    paging: { token: string };
  }[];
  error?: {
    code: number;
  };
};

export const importRouter = createTRPCRouter({
  fromUrl: protectedProcedure
    .input(
      z.object({
        url: z.string().url().regex(QUIZLET_IMPORT_REGEXP),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const url = new URL(input.url);
      const pathname = url.pathname.split("/")[1];
      if (!pathname) {
        throw new Error("Malformed URL");
      }
      const id = pathname;

      const PER_PAGE = 100;

      const res = (await fetch(
        `https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=${id}&filters%5BstudiableContainerType%5D=1&perPage=${PER_PAGE}&page=1`
      ).then((res) => res.json())) as ApiResponse;

      if (!res.responses || !res.responses.length || !res.responses[0]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Something went wrong while importing.",
        });
      }

      const terms: ApiStudiableItem[] = res.responses[0].models.studiableItem;
      let currentLength = res.responses[0].models.studiableItem.length;
      let token = res.responses[0].paging.token;
      let page = 2;

      while (currentLength >= PER_PAGE) {
        const res = (await fetch(
          `https://quizlet.com/webapi/3.4/studiable-item-documents?filters%5BstudiableContainerId%5D=${id}&filters%5BstudiableContainerType%5D=1&perPage=${PER_PAGE}&page=${page++}&pagingToken=${token}`
        ).then((res) => res.json())) as ApiResponse;

        if (res.error && res.error.code == 410) break;
        if (!res.responses || !res.responses.length || !res.responses[0]) break;

        terms.push(...res.responses[0].models.studiableItem);
        currentLength = res.responses[0].models.studiableItem.length;
        token = res.responses[0].paging.token;
      }

      const skippedRanks = new Array<number>();
      const parsed: { word: string; definition: string }[] = [];

      if (!terms.find((t) => t.cardSides)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "This set either doesn't exist or is private. Check the URL and your permissions and try again.",
        });
      }

      for (const term of terms) {
        const cardSides = term.cardSides;
        const wordSide = cardSides.find((s) => s.label == "word")!;
        const definitionSide = cardSides.find((s) => s.label == "definition")!;

        if (!wordSide?.media[0] || !definitionSide?.media[0]) {
          skippedRanks.push(term.rank);
          continue;
        }

        parsed.push({
          word: wordSide.media[0].plainText,
          definition: definitionSide.media[0].plainText,
        });
      }

      await ctx.prisma.setAutoSave.upsert({
        where: {
          userId: ctx.session.user.id,
        },
        update: {
          title: "",
          description: "",
          tags: [],
          visibility: StudySetVisibility.Public,
          userId: ctx.session.user.id,
          autoSaveTerms: {
            deleteMany: { setAutoSaveId: ctx.session.user.id },
            createMany: {
              data: parsed.map((term, i) => ({
                id: nanoid(),
                definition: term.definition,
                word: term.word,
                rank: i,
              })),
            },
          },
        },
        create: {
          title: "",
          description: "",
          tags: [],
          visibility: StudySetVisibility.Public,
          userId: ctx.session.user.id,
          autoSaveTerms: {
            createMany: {
              data: parsed.map((term, i) => ({
                id: nanoid(),
                definition: term.definition,
                word: term.word,
                rank: i,
              })),
            },
          },
        },
      });
    }),
});