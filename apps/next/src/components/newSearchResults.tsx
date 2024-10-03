import React, { useEffect, useState } from "react"; 
import { Input, Box, Button, Stack, Heading, Flex, Text } from "@chakra-ui/react";
import Fuse from "fuse.js";
import { useHistory } from "react-router-dom"; // Make sure to have react-router-dom installed

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
  const history = useHistory(); // Hook for navigation

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
          const data: StudySetResponse = await response.json() as StudySetResponse; // Define the response type

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

  const clearSearch = () => {
    setSearchQuery(""); // Clear the search query
    setSearchResults([]); // Clear search results
  };

  return (
    <Box p={4}>
      <Heading as="h2" size="lg" mb={4}>Search</Heading>
      <Flex mb={2}>
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          mr={2}
        />
        <Button onClick={clearSearch} colorScheme="red">
          X
        </Button>
      </Flex>
      <Box borderWidth={1} borderRadius="lg" overflow="hidden" mt={2}>
        {searchResults.map((result) => (
          <Box
            key={result.id}
            p={3}
            _hover={{ bg: "gray.100", cursor: "pointer" }} // Hover effect
            onClick={() => history.push(`/${result.id}`)} // Navigate to the link
          >
            <Text fontWeight="bold">{result.title}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
