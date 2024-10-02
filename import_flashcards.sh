#!/bin/bash

# Enable debugging and log all output to a file
exec > >(tee -i output.log)
exec 2>&1
set -ex

# Log when the script starts
echo "Starting import script..."

# Source the .env file to load environment variables
if [ -f .env ]; then
  echo "Loading .env file..."
  export $(grep -v '^#' .env | xargs)
else
  echo ".env file not found in the directory. Please check the file path."
  read -p "Press any key to exit..."
  exit
fi

# Log the DATABASE_URL for debugging
echo "DATABASE_URL is: $DATABASE_URL"

# Ensure we can run Node.js commands
echo "Checking Node.js version..."
node -v

# Run the import script to insert flashcards
echo "Starting flashcard import..."
node import_flashcards.js

# Check if the import was successful
if [ $? -eq 0 ]; then
  echo "Flashcards imported successfully!"
else
  echo "Error importing flashcards. Please check the logs."
fi

# Keep the terminal open after the script finishes
echo "Process complete. Press any key to close..."
read -n 1
