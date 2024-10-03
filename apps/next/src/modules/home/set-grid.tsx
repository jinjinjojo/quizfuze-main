import { useEffect, useState } from "react"; // Import necessary hooks
import { useSession } from "next-auth/react"; 
import { api } from "@quenti/trpc";
import Fuse from "fuse.js"; // Import Fuse.js for fuzzy searching
import { Grid, GridItem, Heading, Input, Box, Stack, Skeleton } from "@chakra-ui/react";
import { StudySetCard } from "../../components/study-set-card"; // Import your StudySetCard component
import { useRouter } from 'next/router'; // Import useRouter for navigation

// Define an interface for the StudySet entity
interface StudySet {
  id: string;
  title: string;
}

// Define the response type from the API
interface ApiResponse {
  StudySet: StudySet[];
}

export const SetGrid = () => {
  const { status } = useSession();
  const { data, isLoading: recentLoading } = api.recent.get.useQuery<ApiResponse>(); // Specify the type here
  const isLoading = status === "unauthenticated" || recentLoading;
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [searchResults, setSearchResults] = useState<StudySet[]>([]); // Define state for search results
  const router = useRouter(); // Initialize router for navigation

  // Effect to load data from local storage
  useEffect(() => {
    const localData = localStorage.getItem('studySets'); // Load from local storage
    if (localData) {
      const parsedData: StudySet[] = JSON.parse(localData); // Parse data as StudySet[]
      setSearchResults(parsedData); // Load initial search results from local storage
    }
  }, []);

  // Update local storage whenever data changes
  useEffect(() => {
    if (data?.StudySet) {
      localStorage.setItem('studySets', JSON.stringify(data.StudySet)); // Store study sets in local storage
    }
  }, [data]);

  useEffect(() => {
    // Implement fuzzy search when search query changes
    if (data?.StudySet) {
      const fuse = new Fuse(data.StudySet, {
        keys: ["title"],
        includeScore: true,
        threshold: 0.3,
      });
      const results = searchQuery.length > 0 ? fuse.search(searchQuery) : [];
      setSearchResults(results.map(result => result.item as StudySet)); // Update search results
    }
  }, [searchQuery, data]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query
  };

  if (data && !data.StudySet.length) return null; // Handle case where there are no study sets

  return (
    <Stack spacing={6}>
      <Box position="relative"> {/* Box for positioning the search results dropdown */}
        <Heading size="md">Search</Heading> {/* Search header */}
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange} // Call the change handler
          mt={2}
        />
        {searchResults.length > 0 && (
          <Box position="absolute" mt={2} zIndex={1} bg="white" borderWidth="1px" borderRadius="md" shadow="md">
            {searchResults.map((result) => (
              <Box
                key={result.id}
                p={2}
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
                onClick={() => router.push(`/${result.id}`)} // Navigate to result
              >
                {result.title} {/* Display the title */}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <Skeleton isLoaded={!!data} rounded="md" fitContent>
        <Heading size="lg">Recent</Heading>
      </Skeleton>
      <Grid templateColumns="repeat(auto-fill, minmax(256px, 1fr))" gap={4}>
        {isLoading &&
          Array.from({ length: 16 }).map((_, i) => (
            <GridItem h="156px" key={i}>
              <StudySetCard.Skeleton /> {/* Use your skeleton card component */}
            </GridItem>
          ))}
        {(data?.StudySet || []).map((item) => (
          <GridItem key={item.id} h="156px">
            <StudySetCard
              studySet={item} // Directly pass the item to StudySetCard
            />
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
