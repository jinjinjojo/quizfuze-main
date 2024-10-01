const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const flashcardSets = require('./imported-sets/quizlet_flashcards_4_sets_scraped_on_9_29_2024.json'); // Replace with your JSON file

async function importFlashcards() {
  try {
    for (const set of flashcardSets) {
      console.log(`Importing study set: ${set.title}`);

      const createdStudySet = await prisma.studySet.create({
        data: {
          title: set.title,
          terms: {
            create: set.cards.map(card => ({
              word: card.term,
              definition: card.definition
            }))
          },
          userId: 'cm1qwea6u0001ib036o1hvp8y',  // Quizfuze Account User ID
          visibility: 'Public'     // Set visibility as per your preference
        }
      });

      console.log(`Successfully imported study set: ${createdStudySet.title}`);

      for (const card of set.cards) {
        console.log(`   Imported term: ${card.term} - ${card.definition}`);
      }
    }
  } catch (error) {
    console.error("Error during import:", error);
  } finally {
    await prisma.$disconnect();
  }
}

importFlashcards()
  .then(() => console.log('Flashcard import process complete!'))
  .catch(error => {
    console.error('Failed to import flashcards:', error);
  });
