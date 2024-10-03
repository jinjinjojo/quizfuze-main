import React, { useEffect, useState } from "react"; 
import { Input, Box, Button, Heading, Flex, Text, useColorModeValue } from "@chakra-ui/react";
import Fuse from "fuse.js";
import { Link } from "@quenti/components"; // Import Link from @quenti/components
import { IconX } from '@tabler/icons-react'; // Import X icon from Tabler Icons


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
          const data: StudySetResponse = await response.json() as StudySetResponse; // Define the response type
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

  const bgColor = useColorModeValue("white", "gray.700"); // Background color based on theme

  return (
    <Box>
      <Heading as="h2" size="lg" mb={4}>Search</Heading>
      <Flex mb={2}>
        <Input
          placeholder="Search Through Quizfuze..."
          value={searchQuery}
          onChange={handleSearchInputChange}
          mr={2}
          borderColor="gray.300"
        />
        <Button onClick={clearSearch} colorScheme="red" variant="outline">
          <IconX size={18} />
        </Button>
      </Flex>
      {searchQuery && searchResults.length > 0 && (
        <Box
          borderWidth={1}
          borderRadius="lg"
          overflow="hidden"
          mt={2}
          zIndex={21474836} // Ensure the dropdown is on top
          position="absolute" // Make it sticky
          bg={bgColor} // Background color
          boxShadow="md" // Add some shadow for better visibility
        >
          {searchResults.slice(0, 15).map((result) => ( // Limit to top 15 results
            <Link key={result.id} href={`/${result.id}`} style={{ textDecoration: 'none' }}>
              <Box
                p={3}
                borderBottomWidth={1}
                borderBottomColor="gray.200"
                _last={{ borderBottom: "none" }} // Remove border for last item
                _hover={{ bg: "gray.100", cursor: "pointer", transition: 'background 0.2s' }} // Hover effect
              >
                <Text fontWeight="bold">{result.title}</Text>
              </Box>
            </Link>
          ))}
        </Box>
      )}
    </Box>
  );
};
