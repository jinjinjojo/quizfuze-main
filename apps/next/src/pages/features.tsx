// apps/next/src/pages/features.tsx
import { motion } from "framer-motion";
import Link from "next/link";

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
      title: "Mobile Learning",
      description:
        "Study on-the-go with our mobile-friendly platform. Perfect for quick review sessions during your commute or break time.",
      icon: "fa-mobile-alt",
    },
    {
      title: "Progress Tracking",
      description:
        "Monitor your learning progress with detailed analytics. Identify areas for improvement and celebrate your achievements.",
      icon: "fa-chart-line",
    },
    {
      title: "Customizable Flashcards",
      description:
        "Create rich, multimedia flashcards with text, images, and audio to cater to different learning styles.",
      icon: "fa-clone",
    },
    {
      title: "Intelligent Quizzes",
      description:
        "Generate quizzes based on your study materials and performance, focusing on areas that need improvement.",
      icon: "fa-question-circle",
    },
  ];

  const testimonials = [
    {
      quote:
        "Quizfuze transformed my study habits. I&apos;ve seen a significant improvement in my test scores!",
      author: "Sarah L., College Student",
    },
    {
      quote:
        "As a teacher, I love how Quizfuze makes it easy to create and share study materials with my students.",
      author: "Mark T., High School Teacher",
    },
    {
      quote:
        "The spaced repetition feature is a game-changer. I&apos;m retaining information much better now.",
      author: "Alex R., Lifelong Learner",
    },
  ];

  return (
    <>
      <HeadSeo title="Features - Quizfuze" />
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
              Effective Study Techniques with Quizfuze
            </Heading>
            <Text fontSize="lg" mb={6}>
              Quizfuze is designed to help you study smarter, not harder. Here
              are some tips to maximize your learning:
            </Text>
            <VStack align="start" spacing={4} pl={4}>
              <Text>
                <strong>1. Active Recall:</strong> Use our flashcard feature to
                test yourself frequently. This helps reinforce your memory and
                identifies areas that need more focus.
              </Text>
              <Text>
                <strong>2. Spaced Repetition:</strong> Let our algorithm
                optimize your study schedule. We&apos;ll remind you to review
                material just as you&apos;re about to forget it, strengthening
                your long-term memory.
              </Text>
              <Text>
                <strong>3. Teach Others:</strong> Utilize our collaborative
                features to explain concepts to peers. Teaching is one of the
                most effective ways to solidify your own understanding.
              </Text>
              <Text>
                <strong>4. Visualize Information:</strong> Create mind maps and
                diagrams within your study sets to connect ideas and improve
                comprehension.
              </Text>
              <Text>
                <strong>5. Take Regular Breaks:</strong> Use our mobile app for
                short, frequent study sessions. This approach is more effective
                than long cramming sessions and fits easily into your daily
                routine.
              </Text>
            </VStack>
          </Box>

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
              Join thousands of students who are already benefiting from
              Quizfuze&apos;s powerful learning tools.
            </Text>
            <Link href="/signup" passHref>
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
