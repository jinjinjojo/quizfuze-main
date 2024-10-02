import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Generates a unique set ID in the format: cm1duf87z0001l503fsejo9tp
function generateSetId() {
  const prefix = "cm1";
  const randomPart = Math.random().toString(36).substr(2, 20); // Generate a 20-character string
  return prefix + randomPart;
}

// Function to import flashcards from a given JSON object
async function importFlashcards(flashcardSets: any[], password: string) {
  if (password !== process.env.IMPORT_PASSWORD) {
    throw new Error("Invalid import password.");
  }

  await prisma.$connect();

  for (const set of flashcardSets) {
    try {
      console.log(`Importing study set: ${set.title}`);

      const setId = generateSetId();

      await prisma.studySet.create({
        data: {
          id: setId,
          title: set.title,
          userId: 'cm1qwea6u0001ib036o1hvp8y', // Official Quizfuze Account User ID
          visibility: 'Public', // Set visibility as per your preference
          terms: {
            create: set.cards.map(card => ({
              word: card.term,
              definition: card.definition,
            })),
          },
        },
      });

      console.log(`Successfully imported study set: ${set.title} with ID: ${setId}`);
    } catch (error) {
      console.error(`Error importing study set "${set.title}":`, error);
      throw new Error(`Failed to import study set "${set.title}": ${error.message}`);
    }
  }

  await prisma.$disconnect();
}

// Export the import function to be used elsewhere
export const handleImport = async (flashcardSets: any[], password: string) => {
  try {
    await importFlashcards(flashcardSets, password);
    return { success: true, message: 'Import successful.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
