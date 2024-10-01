#!/bin/bash

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "DATABASE_URL environment variable is not set."
  exit 1
fi

# Run Prisma migration to ensure the database schema is up to date
echo "Running Prisma migrations..."
npx prisma migrate deploy

# Check if the migration was successful
if [ $? -ne 0 ]; then
  echo "Prisma migration failed. Please check your database connection or schema."
  exit 1
fi

# Run the import script to insert flashcards
echo "Starting flashcard import..."
node import_flashcards.js

# Check if the import was successful
if [ $? -eq 0 ]; then
  echo "Flashcards imported successfully!"
else
  echo "Error importing flashcards. Please check the logs."
  exit 1
fi
