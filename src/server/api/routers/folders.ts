import { TRPCError } from "@trpc/server";
import slugify from "slugify";
import { z } from "zod";
import { USERNAME_REGEXP } from "../../../constants/characters";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const foldersRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        username: z.string().max(40).regex(USERNAME_REGEXP),
        slug: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          username: input.username,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const folder = await ctx.prisma.folder.findUnique({
        where: {
          userId_slug: {
            userId: user.id,
            slug: input.slug,
          },
        },
        include: {
          studySets: {
            include: {
              studySet: {
                select: {
                  id: true,
                  title: true,
                  user: true,
                  visibility: true,
                  _count: {
                    select: {
                      terms: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!folder) {
        throw new TRPCError({
          code: "NOT_FOUND",
        });
      }

      const isMyFolder = folder.userId === ctx.session.user.id;
      const studySets = folder.studySets.map((s) => s.studySet);
      const studySetsICanSee = studySets.filter((s) => {
        if (s.visibility === "Public") {
          return true;
        }
        if (s.visibility === "Unlisted") {
          // Prevent users from discovering unlisted study sets
          return s.user.id === ctx.session.user.id || isMyFolder;
        }
        if (s.visibility === "Private") {
          return s.user.id === ctx.session.user.id;
        }

        return false;
      });

      if (!!studySets.length && !studySetsICanSee.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "No study sets in this folder are visible to you",
        });
      }

      return {
        title: folder.title,
        description: folder.description,
        user: {
          id: user.id,
          username: user.username,
          image: user.image,
          verified: user.verified,
        },
        sets: studySetsICanSee.map((s) => ({
          ...s,
          user: {
            id: s.user.id,
            username: s.user.username,
            image: s.user.image,
            verified: s.user.verified,
          },
        })),
      };
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(40),
        description: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.prisma.folder.create({
        data: {
          title: input.title,
          description: input.description,
          userId: ctx.session.user.id,
          slug: slugify(input.title),
        },
      });
    }),
});