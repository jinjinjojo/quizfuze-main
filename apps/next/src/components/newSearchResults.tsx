import React, { useEffect, useState } from "react";
import { Input, Box } from "@chakra-ui/react";
import Fuse from "fuse.js";

interface StudySet {
  id: string;
  title: string;
}

interface NewSearchResultsProps {
  studySets: StudySet[]; // Pass only the study sets to the component
}

export const NewSearchResults: React.FC<NewSearchResultsProps> = ({ studySets }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<StudySet[]>([]);

  useEffect(() => {
    // Implement fuzzy search when search query changes
    if (studySets) {
      const fuse = new Fuse(studySets, {
        keys: ["title"],
        includeScore: true,
        threshold: 0.3,
      });
      const results = searchQuery.length > 0 ? fuse.search(searchQuery) : [];
      setSearchResults(results.map((result) => result.item as StudySet)); // Update search results
    }
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
