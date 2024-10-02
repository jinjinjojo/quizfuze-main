// Load environment variables from .env
// require('dotenv').config();

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const flashcardSets = require('./imported-sets/quizlet_flashcards_4_sets_scraped_on_9_29_2024.json'); // Replace with your JSON file

async function importFlashcards() {
  try {
    // Debug: log the DATABASE_URL to confirm the connection string
    console.log("Connecting to the database using DATABASE_URL:", process.env.DATABASE_URL);

    // Debug: Check the connection to the database
    await prisma.$connect();
    console.log("Connected to the database successfully!");

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
          userId: 'cm1qwea6u0001ib036o1hvp8y',  //! OFFICIAL Quizfuze Account User ID
          visibility: 'Public'     // Set visibility as per your preference
        }
      });

      console.log(`Successfully imported study set: ${createdStudySet.title}`);

      for (const card of set.cards) {
        console.log(`   Imported term: ${card.term} - ${card.definition}`);
      }
    }
  } catch (error) {
    // Debug: Catch and log detailed error information
    console.error("Error during import:", error);
  } finally {
    // Disconnect from the database to avoid hanging connections
    await prisma.$disconnect();
  }
}

// Call the import function with error handling and debugging
importFlashcards()
  .then(() => console.log('Flashcard import process complete!'))
  .catch(error => {
    console.error('Failed to import flashcards:', error);
  });
