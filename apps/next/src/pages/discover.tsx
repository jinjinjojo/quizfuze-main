import { useEffect, useState } from "react";
import { motion } from "framer-motion";
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

const DiscoverPage = () => {
  const [studySets, setStudySets] = useState<StudySet[]>([]);

  // Helper function to randomize and slice data
  const randomizeSets = (sets: StudySet[]) => {
    return sets.sort(() => 0.5 - Math.random()).slice(0, 16); // Randomize and limit to 16
  };

  useEffect(() => {
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
          const data: StudySetResponse = await response.json();
          const randomStudySets = randomizeSets(data.StudySet);
          setStudySets(randomStudySets);
          localStorage.setItem("studySets", JSON.stringify(data.StudySet)); // Cache original data
        } catch (error) {
          console.error("Failed to fetch study sets:", error);
        }
      }
    };

    fetchStudySets().catch((error) => console.error("Failed to fetch study sets:", error));
  }, []);

  return (
    <>
      <HeadSeo title="Discover - Quizfuze" />

      <Container maxW="7xl" py={12}>
        <SimpleGrid columns={[1, null, 4]} spacing={10}>
          {studySets.map((set) => (
            <Box
              key={set.id}
              borderWidth="1px"
              borderRadius="lg"
              p={6}
              boxShadow="md"
              bg="white"
            >
              <VStack spacing={4} align="start">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Heading as="h3" size="md">
                    {set.title}
                  </Heading>
                </motion.div>
                <Link href={`/${set.id}`} passHref>
                  <Button as="a" colorScheme="blue" width="full">
                    Open <IconExternalLink size={18} />
                  </Button> 
                </Link>
              </VStack>
            </Box>
          ))}
        </SimpleGrid>
      </Container>
    </>
  );
};

DiscoverPage.PageWrapper = PageWrapper;
DiscoverPage.getLayout = getLayout;

export default DiscoverPage;
