import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const prisma = new PrismaClient();

// Generates a unique set ID in the format: cm1duf87z0001l503fsejo9tp
async function generateSetId() {
    const prefix = "cm1";
    const randomPart = Array(3).fill(0).map(() => Math.random().toString(36).substr(2)).join('').substr(0, 22);
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
    image?: string; // Optional image field
    sourceImage?: string; // Optional source image field
}

interface FlashcardSet {
    title: string;
    cards: Flashcard[];
}

// Function to import flashcards from a given JSON object
async function importFlashcards(flashcardSets: FlashcardSet[], password: string) {
    if (password !== process.env.IMPORT_PASSWORD) {
        throw new Error("Invalid import password: " + password);
    }

    // Check if the number of flashcard sets exceeds 50
    if (flashcardSets.length > 50) {
        throw new Error("Cannot import more than 50 flashcard sets at a time.");
    }

    await prisma.$connect();

    for (const set of flashcardSets) {
        try {
            console.log(`Importing study set: ${set.title}`);

            const setId = await generateSetId(); // Ensure the generated ID is unique

            // Map cards to terms while setting definition to "" if empty
            const termsToCreate = set.cards.map((card: Flashcard, index: number) => ({
                word: card.term,
                definition: card.definition || "", // Set to "" if definition is empty
                assetUrl: card.sourceImage || null, // Use sourceImage if available
                rank: index, // Set rank based on the index
            })) as Prisma.TermCreateWithoutStudySetInput[];

            // Create the study set first
            await prisma.studySet.create({
                data: {
                    id: setId,
                    title: set.title,
                    description: '',
                    userId: 'cm2rrquuf0000ld03p035i1q1', // Official Quizfuze Account User ID
                    visibility: 'Public', // Set visibility as per your preference
                },
            });

            // Now create terms using createMany
            await prisma.term.createMany({
                data: termsToCreate.map(term => ({
                    ...term,
                    studySetId: setId, // Associate each term with the study set
                })),
            });

            console.log(`Successfully imported study set: ${set.title} with ID: ${setId}`);
        } catch (error) {
            console.error(`Error importing study set "${set.title}":`, error);
            throw new Error(`Failed to import study set "${set.title}": ${error instanceof Error}`);
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
        return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred during import.' };
    }
};

// API handler
// API handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {
            // Validate request body
            const bodySchema = z.object({
                flashcardSets: z.array(z.object({
                    title: z.string(),
                    cards: z.array(z.object({
                        term: z.string(),
                        definition: z.string(),
                        image: z.string().optional(), // Optional field for the image
                        sourceImage: z.string().optional(), // Optional field for the source image
                    })),
                })),
                password: z.string(),
            });

            // Validate and parse request body using zod
            const { flashcardSets, password } = bodySchema.parse(req.body);

            // Split flashcardSets into smaller batches of 50
            const batches = [];
            for (let i = 0; i < flashcardSets.length; i += 50) {
                batches.push(flashcardSets.slice(i, i + 50));
            }

            // Process each batch sequentially
            for (const batch of batches) {
                const result = await handleImport(batch, password);
                if (!result.success) {
                    return res.status(500).json(result);
                }
            }

            return res.status(200).json({ success: true, message: 'All imports successful.' });
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({ success: false, message: error instanceof Error });
            } else if (error instanceof Error) {
                return res.status(500).json({ success: false, message: error.message });
            } else {
                return res.status(500).json({ success: false, message: 'An unknown error occurred.' });
            }
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
