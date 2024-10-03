import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Fuse from "fuse.js"; // Import Fuse.js for fuzzy searching
import { Grid, GridItem, Heading, Input, Box, Stack, Skeleton } from "@chakra-ui/react";
import { StudySetCard } from "../../components/study-set-card";
import { FolderCard } from "../../components/folder-card";
import { useRouter } from 'next/router'; 
import { api } from "@quenti/trpc";

// Define ApiResponse, SetEntity, FolderEntity as before
interface ApiResponse {
  entities: Array<SetEntity | FolderEntity>;
}

interface SetEntity {
  id: string;
  entityType: "set";
  title: string;
  visibility: string;
  type: string;
  collaborators: { total: number; avatars: string[] };
  draft: boolean;
  numItems: number;
  user: {
    username: string;
    image: string;
  };
}

interface FolderEntity {
  id: string;
  entityType: "folder";
  title: string;
  numItems: number;
  user: {
    username: string;
    image: string;
  };
}

export const SetGrid = () => {
  const { status } = useSession();
  const { data, isLoading: recentLoading } = api.recent.get.useQuery<ApiResponse>();
  const isLoading = status === "unauthenticated" || recentLoading;

  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [searchResults, setSearchResults] = useState<SetEntity[]>([]); // Define state for search results
  const router = useRouter();

  // Filter out only sets from the response for searching
  const studySets = (data?.entities || []).filter(
    (entity): entity is SetEntity => entity.entityType === "set"
  );

  // Load search data from localStorage
  useEffect(() => {
    const localData = localStorage.getItem('studySets');
    if (localData) {
      const parsedData: SetEntity[] = JSON.parse(localData);
      setSearchResults(parsedData); // Load initial search results from local storage
    }
  }, []);

  // Update local storage whenever data changes
  useEffect(() => {
    if (studySets.length) {
      localStorage.setItem('studySets', JSON.stringify(studySets)); // Store study sets in local storage
    }
  }, [studySets]);

  // Implement fuzzy search when search query changes
  useEffect(() => {
    if (studySets.length) {
      const fuse = new Fuse(studySets, {
        keys: ["title"],
        includeScore: true,
        threshold: 0.3,
      });
      const results = searchQuery.length > 0 ? fuse.search(searchQuery) : [];
      setSearchResults(results.map(result => result.item)); // Update search results
    }
  }, [searchQuery, studySets]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value); // Update search query
  };

  if (data && !data.entities.length) return null;

  return (
    <Stack spacing={6}>
      <Box position="relative">
        <Heading size="md">Search</Heading>
        <Input
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchInputChange}
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
                onClick={() => router.push(`/${result.id}`)}
              >
                {result.title}
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
              <StudySetCard.Skeleton />
            </GridItem>
          ))}
        {(data?.entities || []).map((item) => (
          <GridItem key={item.id} h="156px">
            {item.entityType == "set" ? (
              <StudySetCard
                studySet={item} // Directly pass the item to StudySetCard
              />
            ) : (
              <FolderCard
                folder={{ ...item }}
                numSets={item.numItems}
                user={item.user}
              />
            )}
          </GridItem>
        ))}
      </Grid>
    </Stack>
  );
};
