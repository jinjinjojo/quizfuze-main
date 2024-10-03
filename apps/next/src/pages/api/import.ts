import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Generates a unique set ID in the format: cm1duf87z0001l503fsejo9tp
async function generateSetId() {
  const prefix = "cm1";
  const randomPart = Math.random().toString(36).substr(2, 20); // Generate a 20-character string
  const setId = prefix + randomPart;

  // Check if the generated ID already exists
  const existingSet = await prisma.studySet.findUnique({
    where: { id: setId },
  });

  // If it exists, generate a new ID
  if (existingSet) {
    return generateSetId(); // Recursively call until a unique ID is found
  }

  return setId;
}

// Define interfaces for flashcards and flashcard sets
interface Flashcard {
  term: string;
  definition: string;
}

interface FlashcardSet {
  title: string;
  cards: Flashcard[];
}

// Function to import flashcards from a given JSON object
async function importFlashcards(flashcardSets: FlashcardSet[], password: string) {
  if (password !== process.env.IMPORT_PASSWORD) {
    throw new Error("Invalid import password.");
  }

  await prisma.$connect();

  for (const set of flashcardSets) {
    try {
      console.log(`Importing study set: ${set.title}`);

      const setId = await generateSetId(); // Ensure the generated ID is unique

      await prisma.studySet.create({
        data: {
            id: setId,
            title: set.title,
            description: '',
            userId: 'cm1qwea6u0001ib036o1hvp8y', // Official Quizfuze Account User ID
            visibility: 'Public', // Set visibility as per your preference
            terms: {
            create: set.cards.map((card: Flashcard) => ({
                word: card.term,
                definition: card.definition,
            })) as prisma.TermCreateWithoutStudySetInput[], // Explicitly type this array
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
export const handleImport = async (flashcardSets: FlashcardSet[], password: string) => {
  try {
    await importFlashcards(flashcardSets, password);
    return { success: true, message: 'Import successful.' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
