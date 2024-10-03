import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@quenti/trpc";
import { Grid, GridItem, Heading, Skeleton, Stack, Input, Box } from "@chakra-ui/react";
import { FolderCard } from "../../components/folder-card";
import { GenericCard } from "../../components/generic-card";
import { StudySetCard } from "../../components/study-set-card";
import Fuse from "fuse.js";

const DB_NAME = "StudySetsDB";
const STORE_NAME = "sets";

const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const saveDataToIndexedDB = async (data) => {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  data.forEach((item) => {
    store.put(item);
  });

  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve();
    };
    transaction.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const fetchDataFromIndexedDB = async () => {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

export const SetGrid = () => {
  const { status } = useSession();
  const { data, isLoading: recentLoading } = api.recent.get.useQuery();
  const isLoading = status === "unauthenticated" || recentLoading;

  // State for search query and results
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [entities, setEntities] = useState([]);

  // Fetch and store the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      const localData = await fetchDataFromIndexedDB();

      if (localData.length > 0) {
        setEntities(localData); // Load from IndexedDB if available
      } else {
        try {
          const response = await fetch("YOUR_JSON_DATA_URL"); // Replace with your JSON file URL
          const jsonData = await response.json();
          await saveDataToIndexedDB(jsonData); // Save to IndexedDB
          setEntities(jsonData); // Set the fetched entities
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);

  // Initialize Fuse.js options
  const fuseOptions = {
    keys: ["title"], // Specify the fields to search
    includeScore: true,
    threshold: 0.3, // Adjust for fuzzy matching
  };

  // Perform search when search query or entities change
  useEffect(() => {
    if (entities.length > 0) {
      const fuse = new Fuse(entities, fuseOptions);
      const results = searchQuery.length > 0 ? fuse.search(searchQuery) : [];
      setSearchResults(results.map(result => result.item)); // Extract matched items
    }
  }, [searchQuery, entities]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement; // Type assertion to HTMLInputElement
    setSearchQuery(target.value);
  };

  if (data && !data.entities.length) return null;

  return (
    <Stack spacing={6}>
      {/* Search Input Section */}
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
                onClick={() => {
                  // Handle click on search result (navigate or do something)
                  console.log(`Selected: ${result.title}`); // For now, just log the selection
                }}
              >
                {result.title} {/* Display the title of the result */}
              </Box>
            ))}
          </Box>
        )}
      </Box>

      {/* Recent Heading */}
      <Skeleton isLoaded={!!data} rounded="md" fitContent>
        <Heading size="lg">Recent</Heading>
      </Skeleton>
      <Grid templateColumns="repeat(auto-fill, minmax(256px, 1fr))" gap={4}>
        {isLoading &&
          Array.from({ length: 16 }).map((_, i) => (
            <GridItem h="156px" key={i}>
              <GenericCard.Skeleton />
            </GridItem>
          ))}
        {(data?.entities || []).map((item) => (
          <GridItem key={item.id} h="156px">
            {item.entityType === "set" ? (
              <StudySetCard
                studySet={{
                  ...item,
                  visibility: item.visibility!,
                  type: item.type!,
                }}
                collaborators={item.collaborators}
                draft={item.draft}
                numTerms={item.numItems}
                user={item.user}
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
