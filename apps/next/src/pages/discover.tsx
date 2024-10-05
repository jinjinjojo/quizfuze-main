import { useEffect, useState } from "react";
import Link from "next/link";
import { HeadSeo } from "@quenti/components/head-seo";
import {
  Box,
  Button,
  Container,
  VStack,
  Heading,
  SimpleGrid,
} from "@chakra-ui/react";
import { PageWrapper } from "../common/page-wrapper";
import { getLayout } from "../layouts/main-layout";
import { IconExternalLink } from '@tabler/icons-react'; // Import X icon from Tabler Icons

interface StudySet {
  id: string;
  title: string;
}

interface StudySetResponse {
  StudySet: StudySet[];
}

// Define props for StudySetCard component
interface StudySetCardProps {
  set: StudySet; // Explicitly define the type for the set prop
}

const DiscoverTitle = () => (
  <Box mb={6}>
    <Heading 
      as="h1" 
      size="lg" 
      textAlign="center" 
      textShadow="1px 1px 2px rgba(0, 0, 0, 0.2)"
      bgGradient="linear(to-r, #d17100, #f6a03d)"
      bgClip="text"
    >
      Discover New Sets
    </Heading>
  </Box>
);

const StudySetCard = ({ set }: StudySetCardProps) => ( // Use the props type here
  <Box
    borderWidth="1px"
    borderRadius="lg"
    p={6}
    boxShadow="md"
    bg="white"
    transition="background-color 0.3s ease"
    _hover={{ bg: "gray.100" }}
    borderColor="gray.200"
    position="relative"
  >
    <VStack spacing={4} align="start">
      <Heading as="h3" size="md">
        {set.title}
      </Heading>
      <Link href={`/${set.id}`} passHref>
        <Button 
          as="a" 
          colorScheme="blue" 
          variant="solid" 
          borderRadius="full" 
          position="absolute" 
          bottom={4} 
          right={4}
          size="sm"
          _hover={{ bg: "blue.600", transform: "scale(1.05)" }} 
        >
          Open <IconExternalLink size={18} />
        </Button>
      </Link>
    </VStack>
  </Box>
);

const DiscoverPage = () => {
  const [studySets, setStudySets] = useState<StudySet[]>([]);

  // Helper function to randomize and slice data
  const randomizeSets = (sets: StudySet[]) => {
    return sets.sort(() => 0.5 - Math.random()).slice(0, 16); // Randomize and limit to 16
  };

  // Define fetchStudySets inside the DiscoverPage component
  const fetchStudySets = async () => {
    const cachedStudySets = localStorage.getItem("studySets");

    if (cachedStudySets) {
      // Parse and randomize study sets from localStorage
      const parsedSets = JSON.parse(cachedStudySets) as StudySet[];
      setStudySets(randomizeSets(parsedSets));
    } else {
      // Fetch from API and randomize the response
      try {
        const response = await fetch("/dev/10-3-24-import.json");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json() as StudySetResponse; // Cast response here

        const randomStudySets = randomizeSets(data.StudySet);
        setStudySets(randomStudySets);
        localStorage.setItem("studySets", JSON.stringify(data.StudySet)); // Cache original data
      } catch (error) {
        console.error("Failed to fetch study sets:", error);
      }
    }
  };

  // Call fetchStudySets within useEffect
  useEffect(() => {
    fetchStudySets().catch((error) => console.error("Failed to fetch study sets:", error));
  }, []);

  return (
    <Box
      bg={{ base: "white", dark: "gray.800" }} // Dark mode support
      color={{ base: "black", dark: "white" }} // Text color adjustments
      minH="100vh"
      p={4}
    >
      <HeadSeo title="Discover - Quizfuze" />
      <DiscoverTitle />
      <Container maxW="7xl" py={12}>
        <SimpleGrid columns={[1, null, 4]} spacing={10}>
          {studySets.map(set => (
            <Box key={set.id} m={2}>
              <StudySetCard set={set} />
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </Box>
  );
};

DiscoverPage.PageWrapper = PageWrapper;
DiscoverPage.getLayout = getLayout;

export default DiscoverPage;
