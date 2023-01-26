import { StarredTerm, Term } from "@prisma/client";

export type SetData = {
  experience: {
    starredTerms: StarredTerm[];
    id: string;
    userId: string;
    studySetId: string;
    shuffleFlashcards: boolean;
  };
  id: string;
  userId: string;
  title: string;
  description: string;
  termOrder: string[];
  terms: Term[];
};