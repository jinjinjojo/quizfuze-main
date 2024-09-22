// apps/next/src/pages/pricing.tsx
import { HeadSeo } from "@quenti/components/head-seo";

import { Box, Container, Heading, Text, VStack } from "@chakra-ui/react";

import { PageWrapper } from "../common/page-wrapper";
import { getLayout } from "../layouts/main-layout";

export default function Page() {
  return (
    <>
      <HeadSeo title="Pricing - Quizfuze" />
      <Container maxW="7xl" py={8}>
        <VStack spacing={8} align="center">
          <Heading as="h1" size="xl">
            Quizfuze is Free for Everyone
          </Heading>
          <Box maxW="2xl" textAlign="center">
            <Text fontSize="xl" mb={4}>
              At Quizfuze, we believe that quality education should be
              accessible to all. That&apos;s why we&apos;re committed to keeping
              our platform completely free for students, teachers, and lifelong
              learners alike.
            </Text>
            <Text fontSize="lg">
              Whether you&apos;re creating flashcards, collaborating with
              classmates, or using our AI-powered study tools, you&apos;ll have
              full access to all of Quizfuze&apos;s features without any cost.
              Our mission is to empower learners worldwide, and we&apos;re proud
              to offer our entire suite of study tools at no charge.
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
}

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;
