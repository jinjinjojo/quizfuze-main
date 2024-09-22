// apps/next/src/pages/privacy-policy.tsx
import { HeadSeo } from "@quenti/components/head-seo";

import {
  Box,
  Container,
  Heading,
  ListItem,
  Text,
  UnorderedList,
  VStack,
} from "@chakra-ui/react";

import { PageWrapper } from "../common/page-wrapper";
import { getLayout } from "../layouts/main-layout";

export default function Page() {
  return (
    <>
      <HeadSeo title="Privacy Policy - Quizfuze" />
      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="start">
          <Heading as="h1" size="xl">
            Privacy Policy
          </Heading>
          <Text>Last updated: September 22nd, 2024</Text>

          <Box>
            <Heading as="h2" size="lg">
              1. Introduction
            </Heading>
            <Text>
              Quizfuze (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, disclose, and safeguard your information when
              you use our website and services.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              2. Information We Collect
            </Heading>
            <Text>We collect the following types of information:</Text>
            <UnorderedList pl={5}>
              <ListItem>
                Personal information (e.g., name, email address) when you create
                an account
              </ListItem>
              <ListItem>
                Profile information you provide (e.g., profile picture,
                educational background)
              </ListItem>
              <ListItem>
                Content you create, upload, or share on our platform
              </ListItem>
              <ListItem>
                Usage data (e.g., study sets created, quiz results, learning
                progress)
              </ListItem>
              <ListItem>
                Device and log information (e.g., IP address, browser type,
                operating system)
              </ListItem>
              <ListItem>
                Information from cookies and similar technologies
              </ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              3. How We Use Your Information
            </Heading>
            <Text>We use your information to:</Text>
            <UnorderedList pl={5}>
              <ListItem>Provide, maintain, and improve our services</ListItem>
              <ListItem>
                Personalize your experience and deliver tailored content
              </ListItem>
              <ListItem>
                Process transactions and send related information
              </ListItem>
              <ListItem>
                Send you technical notices, updates, security alerts, and
                support messages
              </ListItem>
              <ListItem>
                Respond to your comments, questions, and customer service
                requests
              </ListItem>
              <ListItem>
                Monitor and analyze trends, usage, and activities in connection
                with our services
              </ListItem>
              <ListItem>
                Detect, investigate, and prevent fraudulent transactions and
                other illegal activities
              </ListItem>
              <ListItem>Comply with legal obligations</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              4. Information Sharing and Disclosure
            </Heading>
            <Text>
              We do not sell your personal information. We may share your
              information in the following situations:
            </Text>
            <UnorderedList pl={5}>
              <ListItem>With your consent</ListItem>
              <ListItem>
                With service providers, contractors, and agents who perform
                services for us
              </ListItem>
              <ListItem>To comply with legal obligations</ListItem>
              <ListItem>
                To protect our rights, privacy, safety or property, and/or that
                of our users or others
              </ListItem>
              <ListItem>
                In connection with, or during negotiations of, any merger, sale
                of company assets, financing, or acquisition of all or a portion
                of our business by another company
              </ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              5. Data Retention
            </Heading>
            <Text>
              We retain your information for as long as necessary to provide our
              services and fulfill the purposes outlined in this Privacy Policy,
              unless a longer retention period is required or permitted by law.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              6. Data Security
            </Heading>
            <Text>
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized or unlawful
              processing, accidental loss, destruction, or damage. However, no
              method of transmission over the Internet or electronic storage is
              100% secure, and we cannot guarantee absolute security.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              7. Your Rights and Choices
            </Heading>
            <Text>Depending on your location, you may have the right to:</Text>
            <UnorderedList pl={5}>
              <ListItem>
                Access and receive a copy of your personal information
              </ListItem>
              <ListItem>Rectify inaccurate personal information</ListItem>
              <ListItem>Request deletion of your personal information</ListItem>
              <ListItem>
                Object to or restrict the processing of your personal
                information
              </ListItem>
              <ListItem>Data portability</ListItem>
              <ListItem>
                Withdraw consent at any time, where we rely on consent to
                process your personal information
              </ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              8. Children&apos;s Privacy
            </Heading>
            <Text>
              Our services are not directed to children under 13. If we learn we
              have collected personal information from a child under 13, we will
              delete that information as quickly as possible. If you believe we
              might have any information from or about a child under 13, please
              contact us.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              9. International Data Transfers
            </Heading>
            <Text>
              Your information may be transferred to, and maintained on,
              computers located outside of your state, province, country, or
              other governmental jurisdiction where the data protection laws may
              differ from those in your jurisdiction.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              10. Changes to This Privacy Policy
            </Heading>
            <Text>
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the &quot;Last updated&quot; date.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">
              11. Contact Us
            </Heading>
            <Text>
              If you have any questions about this Privacy Policy, please
              contact us at privacy@quizfuze.com.
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
}

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;
