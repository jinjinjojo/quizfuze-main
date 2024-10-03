import { motion } from "framer-motion";
import Link from "next/link";
import Head from "next/head"; // Import Head

import { HeadSeo } from "@quenti/components/head-seo";

import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Icon,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react";

import { PageWrapper } from "../common/page-wrapper";
import { getLayout } from "../layouts/main-layout";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
}

const FeatureCard = ({ title, description, icon }: FeatureCardProps) => (
  <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="md" bg="white">
    <VStack spacing={4} align="start">
      <HStack>
        <motion.div whileHover={{ scale: 1.2 }} whileTap={{ scale: 0.8 }}>
          <Icon
            as={() => <i className={`fas ${icon}`} />}
            boxSize="2em"
            color="#4b83ff"
          />
        </motion.div>
        <Heading as="h3" size="md">
          {title}
        </Heading>
      </HStack>
      <Text>{description}</Text>
    </VStack>
  </Box>
);

const Testimonial = ({ quote, author }: { quote: string; author: string }) => (
  <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="md" bg="white">
    <Text fontStyle="italic" mb={4}>
      &ldquo;{quote}&rdquo;
    </Text>
    <Text fontWeight="bold">- {author}</Text>
  </Box>
);

export default function Page() {
  const features: FeatureCardProps[] = [
    {
      title: "Spaced Repetition",
      description:
        "Our algorithm optimizes your study schedule, presenting information at increasing intervals to boost long-term retention.",
      icon: "fa-brain",
    },
    {
      title: "Collaborative Learning",
      description:
        "Create study groups, share materials, and learn together. Peer-to-peer learning enhances understanding and retention.",
      icon: "fa-users",
    },
    {
      title: "Rich Text Features",
      description:
        "Emphasize important terms with bold, underline, and highlight options, making your study materials more engaging.",
      icon: "fa-pencil-alt",
    },
    {
      title: "Language Learning Support",
      description:
        "Learn over 100 languages with built-in accent help and answer grading for effective language acquisition.",
      icon: "fa-language",
    },
    {
      title: "Command Menu & Shortcuts",
      description:
        "Navigate quickly and efficiently using our command menu and keyboard shortcuts to enhance your learning experience.",
      icon: "fa-keyboard",
    },
    {
      title: "Unlimited Studying",
      description:
        "Access a vast array of study materials without any limits. Study whenever you want, for as long as you need.",
      icon: "fa-infinity",
    },
  ];

  const testimonials = [
    {
      quote:
        "Quizfuze transformed my study habits. I have seen a significant improvement in my test scores!",
      author: "Sarah L., College Student",
    },
    {
      quote:
        "As a teacher, I love how Quizfuze makes it easy to create and share study materials with my students.",
      author: "Mark T., High School Teacher",
    },
    {
      quote:
        "I like how Quizfuze is free forever, and works just as well as Quizlet. I can easily ace all of my exams because of this tool!",
      author: "Alex R., 11th Grade Student",
    },
  ];

  return (
    <>
      <HeadSeo title="Features - Quizfuze" />
      <Head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </Head>
      <Container maxW="7xl" py={12}>
        <VStack spacing={16} align="center">
          <Box textAlign="center">
            <Heading as="h1" size="2xl" mb={4}>
              Powerful Features for Effective Learning
            </Heading>
            <Text fontSize="xl" color="gray.600">
              Discover how Quizfuze can revolutionize your study experience
            </Text>
          </Box>

          <SimpleGrid columns={[1, null, 3]} spacing={10} width="full">
            {features.map((feature, index) => (
              <FeatureCard key={index} {...feature} />
            ))}
          </SimpleGrid>

          <Box width="full">
            <Heading as="h2" size="xl" mb={6}>
              What Our Users Say
            </Heading>
            <SimpleGrid columns={[1, null, 3]} spacing={10}>
              {testimonials.map((testimonial, index) => (
                <Testimonial key={index} {...testimonial} />
              ))}
            </SimpleGrid>
          </Box>

          <Box textAlign="center">
            <Heading as="h2" size="xl" mb={4}>
              Ready to Elevate Your Learning?
            </Heading>
            <Text fontSize="lg" mb={6}>
              Join Quizfuze Today!.
            </Text>
            <Link href="/auth/signup" passHref>
              <Button as="a" colorScheme="blue" size="lg">
                Get Started for Free
              </Button>
            </Link>
          </Box>
        </VStack>
      </Container>
    </>
  );
}

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;
