import React, { useEffect, useState } from "react"; 
import { Input, Box } from "@chakra-ui/react";
import Fuse from "fuse.js";

interface StudySet {
  id: string;
  title: string;
}

interface StudySetResponse {
  StudySet: StudySet[]; // Define the expected response structure
}

export const NewSearchResults: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<StudySet[]>([]);
  const [studySets, setStudySets] = useState<StudySet[]>([]); // State to store study sets

  useEffect(() => {
    // Fetch study sets from localStorage or API
    const fetchStudySets = async () => {
      const cachedStudySets = localStorage.getItem("studySets");
      
      if (cachedStudySets) {
        // Load from localStorage if data exists
        setStudySets(JSON.parse(cachedStudySets) as StudySet[]);
      } else {
        // Fetch from API if no cached data
        try {
          const response = await fetch("/dev/10-3-24-import.json");
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data: StudySetResponse = await response.json(); // Define the response type

          // Access the study sets array from the response
          setStudySets(data.StudySet); // Store fetched study sets
          localStorage.setItem("studySets", JSON.stringify(data.StudySet)); // Cache data in localStorage
        } catch (error) {
          console.error("Failed to fetch study sets:", error);
        }
      }
    };

    fetchStudySets().catch((error) => {
      console.error("Failed to fetch study sets:", error); // Handle promise rejection
    });
  }, []); // Run once on mount

  useEffect(() => {
    // Implement fuzzy search when search query or study sets change
    const fuse = new Fuse(studySets, {
      keys: ["title"],
      includeScore: true,
      threshold: 0.3,
    });
    const results = searchQuery.length > 0 ? fuse.search(searchQuery) : [];
    setSearchResults(results.map((result) => result.item)); // Update search results
  }, [searchQuery, studySets]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query
  };

  return (
    <Box>
      <Input
        placeholder="Search..."
        value={searchQuery}
        onChange={handleSearchInputChange}
      />
      <Box mt={2}>
        {searchResults.length > 0 ? (
          searchResults.map((result) => (
            <Box key={result.id} p={2}>
              {result.title}
            </Box>
          ))
        ) : (
          <Box>No results found.</Box>
        )}
      </Box>
    </Box>
  );
};
