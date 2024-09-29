import React from "react";
import { createStore, useStore } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type { Distractor } from "@quenti/interfaces";

import type {
  Question,
  RoundSummary,
  StudiableTermWithDistractors,
  TermWithDistractors,
} from "@quenti/interfaces";
import { shuffleArray } from "@quenti/lib/array";
import { SPECIAL_CHAR_REGEXP } from "@quenti/lib/constants/characters";
import { LEARN_TERMS_IN_ROUND } from "@quenti/lib/constants/learn";
import { CORRECT, INCORRECT } from "@quenti/lib/constants/remarks";
import type { LearnMode, StudySetAnswerMode } from "@quenti/prisma/client";

import { word } from "../utils/terms";

export interface LearnStoreProps {
  mode: LearnMode;
  answerMode: StudySetAnswerMode;
  studiableTerms: StudiableTermWithDistractors[];
  allTerms: TermWithDistractors[];
  numTerms: number;
  termsThisRound: number;
  currentRound: number;
  roundProgress: number;
  roundCounter: number;
  roundTimeline: Question[];
  specialCharacters: string[];
  feedbackBank: { correct: string[]; incorrect: string[] };
  answered?: string;
  status?: "correct" | "incorrect" | "unknownPartial";
  roundSummary?: RoundSummary;
  completed: boolean;
  hasMissedTerms?: boolean;
  prevTermWasIncorrect?: boolean;
}

interface LearnState extends LearnStoreProps {
  initialize: (
    mode: LearnMode,
    answerMode: StudySetAnswerMode,
    studiableTerms: StudiableTermWithDistractors[],
    allTerms: TermWithDistractors[],
    round: number,
  ) => void;
  answerCorrectly: (termId: string) => void;
  answerIncorrectly: (termId: string) => void;
  acknowledgeIncorrect: () => void;
  answerUnknownPartial: () => void;
  overrideCorrect: () => void;
  endQuestionCallback: (correct: boolean) => void;
  correctFromUnknown: (termId: string) => void;
  incorrectFromUnknown: (termId: string) => void;
  nextRound: (start?: boolean) => void;
  setFeedbackBank: (correct: string[], incorrect: string[]) => void;
}

export type LearnStore = ReturnType<typeof createLearnStore>;

export const createLearnStore = (initProps?: Partial<LearnStoreProps>) => {
  const DEFAULT_PROPS: LearnStoreProps = {
    mode: "Learn",
    answerMode: "Definition",
    studiableTerms: [],
    allTerms: [],
    numTerms: 0,
    termsThisRound: 0,
    currentRound: 0,
    roundProgress: 0,
    roundCounter: 0,
    roundTimeline: [],
    specialCharacters: [],
    feedbackBank: { correct: CORRECT, incorrect: INCORRECT },
    completed: false,
  };

  return createStore<LearnState>()(
    subscribeWithSelector((set) => ({
      ...DEFAULT_PROPS,
      ...initProps,
      initialize: (mode, answerMode, studiableTerms, allTerms, round) => {
        console.log("initialize - input data:", {
          mode,
          answerMode,
          studiableTerms,
          allTerms,
          round
        });

        const words =
          answerMode != "Both"
            ? studiableTerms.map((x) => word(answerMode, x, "answer"))
            : studiableTerms.map((x) => [x.word, x.definition]).flat();

        const specialCharacters = Array.from(
          new Set(
            words
              .map((word) =>
                [...word.matchAll(SPECIAL_CHAR_REGEXP)]
                  .map((x) => Array.from(x))
                  .flat(),
              )
              .flat()
              .map((x) => x.split(""))
              .flat(),
          ),
        );

        // Ensure all terms have distractors
        const termsWithDistractors = studiableTerms.map((term) => {
          if (term.distractors.length === 0) {
            const otherTerms = allTerms.filter((t) => t.id !== term.id);
            const distractors = otherTerms
              .slice(0, 3)
              .map((t) => ({
                distractingId: t.id,
                termId: term.id,
                type: answerMode as StudySetAnswerMode
              }));
            return { ...term, distractors };
          }
          return term;
        });

       set({
          mode,
          answerMode,
          studiableTerms: termsWithDistractors.map(term => ({
            ...term,
            distractors: term.distractors.map(d => ({
              id: `${term.id}-${d.distractingId}`,
              distractingId: d.distractingId,
              termId: d.termId,
              type: d.type,
              createdAt: new Date(),
              updatedAt: new Date()
            } as Distractor))
          })) as StudiableTermWithDistractors[],
          allTerms,
          numTerms: termsWithDistractors.length,
          currentRound: round,
          specialCharacters,
        });

        set((state) => {
          state.nextRound(true);
          return {};
        });
      },
      answerCorrectly: (termId) => {
        set({
          answered: termId,
          status: "correct",
          prevTermWasIncorrect: false,
        });

        setTimeout(() => {
          set((state) => {
            const active = state.roundTimeline[state.roundCounter]!;
            active.term.correctness = active.type == "choice" ? 1 : 2;

            state.endQuestionCallback(true);
            return {};
          });
        }, 1000);
      },
      answerIncorrectly: (termId) => {
        set((state) => ({
          answered: termId,
          status: "incorrect",
          roundTimeline:
            state.roundProgress != state.termsThisRound - 1
              ? [
                  ...state.roundTimeline,
                  state.roundTimeline[state.roundCounter]!,
                ]
              : state.roundTimeline,
          prevTermWasIncorrect: true,
        }));
      },
      acknowledgeIncorrect: () => {
        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          active.term.correctness = -1;
          active.term.incorrectCount++;

          state.endQuestionCallback(false);
          return {};
        });
      },
      answerUnknownPartial: () => {
        set({ status: "unknownPartial" });
      },
      overrideCorrect: () => {
        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          active.term.correctness = 2;

          const roundTimeline = state.roundTimeline;
          if (state.roundProgress != state.termsThisRound - 1) {
            // Remove the added question from the timeline
            roundTimeline.splice(-1);
          }

          state.endQuestionCallback(true);
          return {
            roundTimeline,
            prevTermWasIncorrect: false,
          };
        });
      },
      endQuestionCallback: (correct) => {
        set((state) => {
          const masteredCount = state.studiableTerms.filter(
            (x) => x.correctness == 2,
          ).length;
          if (masteredCount == state.numTerms) {
            const hasMissedTerms = !!state.studiableTerms.find(
              (x) => x.incorrectCount > 0,
            );
            return { completed: true, hasMissedTerms };
          }

          if (state.roundProgress === state.termsThisRound - 1) {
            return {
              roundSummary: {
                round: state.currentRound,
                termsThisRound: Array.from(
                  new Set(state.roundTimeline.map((q) => q.term)),
                ),
                progress: state.studiableTerms.filter((x) => x.correctness != 0)
                  .length,
                totalTerms: state.numTerms,
              },
              status: undefined,
            };
          }

          const roundCounter = state.roundCounter + 1;
          const roundProgress = state.roundProgress + (correct ? 1 : 0);

          return {
            roundCounter,
            roundProgress,
            answered: undefined,
            status: undefined,
          };
        });
      },
      correctFromUnknown: (termId) => {
        set({
          answered: termId,
          prevTermWasIncorrect: false,
        });

        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          active.term.correctness = active.type == "choice" ? 1 : 2;

          state.endQuestionCallback(true);
          return {};
        });
      },
      incorrectFromUnknown: (termId) => {
        set((state) => ({
          answered: termId,
          roundTimeline:
            state.roundProgress != state.termsThisRound - 1
              ? [
                  ...state.roundTimeline,
                  state.roundTimeline[state.roundCounter]!,
                ]
              : state.roundTimeline,
          prevTermWasIncorrect: true,
        }));

        set((state) => {
          const active = state.roundTimeline[state.roundCounter]!;
          active.term.correctness = -1;
          active.term.incorrectCount++;

          state.endQuestionCallback(false);
          return {};
        });
      },
      nextRound: (start = false) => {
        set((state) => {
          const currentRound = state.currentRound + (!start ? 1 : 0);

          const incorrectTerms = state.studiableTerms.filter(
            (x) => x.correctness == -1,
          );
          const unstudied = state.studiableTerms.filter(
            (x) => x.correctness == 0,
          );

          const familiarTerms = state.studiableTerms.filter(
            (x) => x.correctness == 1,
          );
          const familiarTermsWithRound = familiarTerms.map((x) => {
            if (x.appearedInRound === undefined)
              throw new Error("No round information for familiar term!");
            return x;
          });

          const termsThisRound = incorrectTerms
            .concat(
              familiarTermsWithRound.filter(
                (x) => currentRound - x.appearedInRound! >= 2,
              ),
            )
            .concat(unstudied)
            .concat(familiarTerms)
            .slice(0, LEARN_TERMS_IN_ROUND);

          termsThisRound.forEach((x) => {
            if (x.correctness == 0) x.appearedInRound = currentRound;
          });

          const roundTimeline: Question[] = termsThisRound.map((term) => {
            const answerMode: StudySetAnswerMode =
              state.answerMode != "Both"
                ? state.answerMode
                : Math.random() < 0.5
                  ? "Definition"
                  : "Word";

            const distractorIds = term.distractors
              .filter((x) => x.type == answerMode)
              .map((x) => x.distractingId);
            let distractors = state.allTerms.filter((x) =>
              distractorIds.includes(x.id)
            );

            if (distractors.length < 3) {
              const additionalDistractors = state.allTerms
                .filter((x) => x.id !== term.id && !distractorIds.includes(x.id))
                .slice(0, 3 - distractors.length);
              distractors = [...distractors, ...additionalDistractors];
            }

            const numberOfChoices = Math.min(4, distractors.length + 1);
            const choices = shuffleArray([term, ...distractors])
              .slice(0, numberOfChoices);

            console.log("Generated choices for term:", term.id, choices);

            return {
              answerMode,
              choices,
              term,
              type: "choice",
            };
          });

          console.log("nextRound - roundTimeline:", roundTimeline);

          return {
            roundSummary: undefined,
            termsThisRound: termsThisRound.length,
            roundTimeline,
            roundCounter: 0,
            roundProgress: 0,
            answered: undefined,
            status: undefined,
            completed: !termsThisRound.length,
            hasMissedTerms: !!state.studiableTerms.find(
              (x) => x.incorrectCount > 0,
            ),
            currentRound,
          };
        });
      },
      setFeedbackBank: (correct, incorrect) => {
        set({
          feedbackBank: { correct, incorrect },
        });
      },
    })),
  );
};

export const LearnContext = React.createContext<LearnStore | null>(null);

export const useLearnContext = <T>(selector: (state: LearnState) => T): T => {
  const store = React.useContext(LearnContext);
  if (!store) throw new Error("Missing LearnContext.Provider in the tree");

  console.log("useLearnContext - current state:", {
    roundTimeline: store.getState().roundTimeline,
    termsThisRound: store.getState().termsThisRound,
    roundCounter: store.getState().roundCounter,
    currentQuestion: store.getState().roundTimeline[store.getState().roundCounter]
  });

  return useStore(store, selector);
};
