import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@quenti/trpc";
import { Grid, GridItem, Heading, Skeleton, Stack, Input, Box } from "@chakra-ui/react";
import { FolderCard } from "../../components/folder-card";
import { GenericCard } from "../../components/generic-card";
import { StudySetCard } from "../../components/study-set-card";
import Fuse from "fuse.js";

interface StudySet {
  id: string; // or number, depending on your data
  title: string;
  // Add other fields as necessary
}

const DB_NAME = "StudySetsDB";
const STORE_NAME = "sets";

const openDatabase = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const target = event.target as IDBOpenDBRequest; // Cast to IDBOpenDBRequest
      const db = target.result; // Accessing result safely
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const target = event.target as IDBOpenDBRequest; // Cast to IDBOpenDBRequest
      resolve(target.result); // Now it's safe to access result
    };

    request.onerror = (event) => {
      const target = event.target as IDBOpenDBRequest; // Cast to IDBOpenDBRequest
      reject(target.error); // Accessing error safely
    };
  });
};

const saveDataToIndexedDB = async (data: StudySet[]): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction(STORE_NAME, "readwrite");
  const store = transaction.objectStore(STORE_NAME);

  data.forEach((item) => {
    store.put(item);
  });

  return new Promise<void>((resolve, reject) => {
    transaction.oncomplete = () => {
      resolve(); // Now this works since resolve() is inferred as returning void
    };
    transaction.onerror = (event) => {
      reject((event.target as IDBRequest).error); // Cast for proper type
    };
  });
};

const fetchDataFromIndexedDB = async (): Promise<StudySet[]> => {
  const db = await openDatabase();
  return new Promise<StudySet[]>((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = (event: Event) => {
      const target = event.target as IDBRequest; // Cast to IDBRequest
      resolve(target.result as StudySet[]); // Ensure the result is of type StudySet[]
    };

    request.onerror = (event: Event) => {
      const target = event.target as IDBRequest; // Cast to IDBRequest
      reject(target.error); // Reject with the error
    };
  });
};

// Validation function to check if the data matches the StudySet type
const validateStudySetData = (data: unknown): data is StudySet[] => {
  return Array.isArray(data) && data.every(item => typeof item.id === 'string' && typeof item.title === 'string');
};

export const SetGrid = () => {
  const { status } = useSession();
  const { data, isLoading: recentLoading } = api.recent.get.useQuery();
  const isLoading = status === "unauthenticated" || recentLoading;

  // State for search query and results
  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [searchResults, setSearchResults] = useState<StudySet[]>([]); 
  const [entities, setEntities] = useState<StudySet[]>([]); 

  // Fetch and store the data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const localData: StudySet[] = await fetchDataFromIndexedDB();

        if (localData.length > 0) {
          setEntities(localData); // Load from IndexedDB if available
        } else {
          const response = await fetch("https://app.quizfuze.com/dev/10-3-24-import.json");
          const jsonData = await response.json();

          // Validate the fetched data
          if (validateStudySetData(jsonData)) {
            await saveDataToIndexedDB(jsonData); // Save to IndexedDB
            setEntities(jsonData); // Set the fetched entities
          } else {
            console.error("Invalid data format:", jsonData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData().catch(error => console.error("Unhandled promise:", error)); // Fix no-floating-promise issue
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

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => { // Specify the type for the event
    setSearchQuery(e.target.value);
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
