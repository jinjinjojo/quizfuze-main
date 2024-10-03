import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "@quenti/trpc";
import { Grid, GridItem, Heading, Skeleton, Stack, Input, Box } from "@chakra-ui/react";
import { FolderCard } from "../../components/folder-card";
import { GenericCard } from "../../components/generic-card";
import { StudySetCard } from "../../components/study-set-card";
import Fuse from "fuse.js";

interface StudySet {
  id: string; // Assuming the id is a string, change to number if necessary
  title: string;
  // Add other necessary fields
}

interface Folder {
  id: string;
  // Add fields for Folder entity
}

interface Entity {
  id: string;
  title: string;
  entityType: 'set' | 'folder'; // Define entity types
  visibility?: string;
  type?: string;
  collaborators?: any[];
  draft?: boolean;
  numItems: number;
  user?: any;
}

const DB_NAME = "StudySetsDB";
const STORE_NAME = "sets";

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event) => {
      reject((event.target as IDBOpenDBRequest).error);
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
      resolve();
    };
    transaction.onerror = (event) => {
      reject((event.target as IDBRequest).error);
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
      resolve((event.target as IDBRequest).result as StudySet[]);
    };

    request.onerror = (event: Event) => {
      reject((event.target as IDBRequest).error);
    };
  });
};

// Validation function to check if the data matches the StudySet type
const validateStudySetData = (data: any): data is StudySet[] => {
  return Array.isArray(data) && data.every(item => typeof item.id === 'string' && typeof item.title === 'string');
};

export const SetGrid = () => {
  const { status } = useSession();
  const { data, isLoading: recentLoading } = api.recent.get.useQuery();
  const isLoading = status === "unauthenticated" || recentLoading;

  const [searchQuery, setSearchQuery] = useState<string>(""); 
  const [searchResults, setSearchResults] = useState<StudySet[]>([]); 
  const [entities, setEntities] = useState<Entity[]>([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const localData: StudySet[] = await fetchDataFromIndexedDB();

        if (localData.length > 0) {
          setEntities(localData); 
        } else {
          const response = await fetch("https://app.quizfuze.com/dev/10-3-24-import.json");
          const jsonData = await response.json();

          if (validateStudySetData(jsonData)) {
            await saveDataToIndexedDB(jsonData); 
            setEntities(jsonData); 
          } else {
            console.error("Invalid data format:", jsonData);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const fuseOptions = {
    keys: ["title"],
    includeScore: true,
    threshold: 0.3, 
  };

  useEffect(() => {
    if (entities.length > 0) {
      const fuse = new Fuse(entities, fuseOptions);
      const results = searchQuery.length > 0 ? fuse.search(searchQuery) : [];
      setSearchResults(results.map(result => result.item));
    }
  }, [searchQuery, entities]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
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
                onClick={() => console.log(`Selected: ${result.title}`)}
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
              <GenericCard.Skeleton />
            </GridItem>
          ))}
        {(data?.entities || []).map((item: Entity) => (
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
