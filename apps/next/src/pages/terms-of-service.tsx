// apps/next/src/pages/terms-of-service.tsx

import { HeadSeo } from "@quenti/components/head-seo";
import { Container, Heading, Text, VStack, Box, UnorderedList, ListItem } from "@chakra-ui/react";
import { PageWrapper } from "../common/page-wrapper";
import { getLayout } from "../layouts/main-layout";

export default function Page() {
  return (
    <>
      <HeadSeo title="Terms of Service - Quizfuze" />
      <Container maxW="7xl" py={8}>
        <VStack spacing={6} align="start">
          <Heading as="h1" size="xl">Terms of Service</Heading>
          <Text>Last updated: September 22nd, 2024</Text>
          
          <Box>
            <Heading as="h2" size="lg">1. Acceptance of Terms</Heading>
            <Text>
              By accessing or using Quizfuze, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any part of these terms, you may not use our services.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">2. Description of Service</Heading>
            <Text>
              Quizfuze is an online learning platform that allows users to create, share, and study educational content through flashcards, quizzes, and other interactive tools.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">3. User Accounts</Heading>
            <Text>
              To use certain features of Quizfuze, you may be required to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You must immediately notify Quizfuze of any unauthorized use of your account or any other breach of security.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">4. User Content</Heading>
            <Text>
              You retain all rights to any content you submit, post, or display on Quizfuze. By posting content, you grant Quizfuze a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content for the purpose of providing our services. You represent and warrant that you have all necessary rights to grant this license.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">5. Prohibited Activities</Heading>
            <Text>Users agree not to engage in any of the following activities:</Text>
            <UnorderedList pl={5}>
              <ListItem>Violating any applicable laws or regulations</ListItem>
              <ListItem>Infringing on the intellectual property rights of others</ListItem>
              <ListItem>Uploading or transmitting viruses or malicious code</ListItem>
              <ListItem>Impersonating others or providing false information</ListItem>
              <ListItem>Interfering with or disrupting the integrity of the Quizfuze platform</ListItem>
              <ListItem>Collecting user information without their consent</ListItem>
              <ListItem>Using the service for any illegal or unauthorized purpose</ListItem>
            </UnorderedList>
          </Box>

          <Box>
            <Heading as="h2" size="lg">6. Intellectual Property</Heading>
            <Text>
              The Quizfuze service and its original content, features, and functionality are owned by Quizfuze and are protected by international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">7. Termination</Heading>
            <Text>
              We reserve the right to terminate or suspend your account and access to Quizfuze at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties, or for any other reason.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">8. Disclaimer of Warranties</Heading>
            <Text>
              Quizfuze is provided &quot;as is&quot; without any warranties, expressed or implied. We do not guarantee that our services will be uninterrupted or error-free. Your use of the service is at your sole risk.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">9. Limitation of Liability</Heading>
            <Text>
              Quizfuze and its affiliates will not be liable for any indirect, incidental, special, consequential or punitive damages resulting from your use of or inability to use our services.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">10. Changes to Terms</Heading>
            <Text>
              We reserve the right to modify these terms at any time. We will always post the most current version on our site. By continuing to use Quizfuze after changes become effective, you agree to be bound by the revised terms.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">11. Governing Law</Heading>
            <Text>
              These Terms shall be governed by and construed in accordance with the laws of [Your Jurisdiction], without regard to its conflict of law provisions.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">11. Governing Law and Jurisdiction</Heading>
            <Text>
              These Terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. You and Quizfuze agree to submit to the personal and exclusive jurisdiction of the courts located within San Francisco County, California.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">12. California Residents</Heading>
            <Text>
              If you are a California resident, you are entitled to certain specific consumer rights information. This section is intended to comply with the California Consumer Privacy Act (CCPA) and other applicable California laws.
            </Text>
            <UnorderedList pl={5} mt={2}>
              <ListItem>
                You have the right to request information about the categories and specific pieces of personal information we have collected about you, as well as the categories of sources from which such information is collected, the purpose for collecting such information, and the categories of third parties with whom we share such information.
              </ListItem>
              <ListItem>
                You have the right to request information about our sale or disclosure for business purposes of your personal information to third parties.
              </ListItem>
              <ListItem>
                You have the right to opt out of the sale of your personal information to third parties.
              </ListItem>
              <ListItem>
                You have the right to request the deletion of your personal information in certain situations.
              </ListItem>
              <ListItem>
                You have the right not to be discriminated against for exercising any of the rights listed above.
              </ListItem>
            </UnorderedList>
            <Text mt={2}>
              To exercise any of these rights, please contact us at privacy@quizfuze.com. We will respond to your request within 45 days.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">13. California Online Privacy Protection Act Compliance</Heading>
            <Text>
              We comply with the California Online Privacy Protection Act. As part of this, we agree not to share your personal information with third parties for their direct marketing purposes without your consent. If you have any questions about our compliance with this law, please contact us at privacy@quizfuze.com.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">14. California&apos;s Shine the Light Law</Heading>
            <Text>
              California Civil Code Section 1798.83, also known as the &quot;Shine The Light&quot; law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below.
            </Text>
          </Box>

          <Box>
            <Heading as="h2" size="lg">15. Contact Us</Heading>
            <Text>
              If you have any questions about these Terms, please contact us at support@quizfuze.com.
            </Text>
          </Box>
        </VStack>
      </Container>
    </>
  );
}

Page.PageWrapper = PageWrapper;
Page.getLayout = getLayout;
