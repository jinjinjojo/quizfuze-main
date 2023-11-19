import React from "react";

import type { Term } from "@quenti/prisma/client";

import { Box, Card, Center, Flex, HStack, Text } from "@chakra-ui/react";

import { IconEditCircle, IconStar } from "@tabler/icons-react";

interface DeloadedTermProps {
  term: Term;
  creator?: boolean;
}

export const DeloadedTermRaw: React.FC<DeloadedTermProps> = ({
  term,
  creator,
}) => {
  return (
    <Card
      px={{ base: 0, md: "22px" }}
      py={{ base: 0, md: 5 }}
      shadow="0 2px 6px -4px rgba(0, 0, 0, 0.1), 0 2px 4px -4px rgba(0, 0, 0, 0.06)"
      borderWidth="1.5px"
      transition="border-color 0.15s ease-in-out"
      borderColor="gray.100"
      rounded="xl"
      _dark={{
        bg: "gray.750",
        borderColor: "gray.700",
      }}
    >
      <Flex
        flexDir={{ base: "column-reverse", md: "row" }}
        alignItems="stretch"
        gap={{ base: 0, md: 6 }}
      >
        <Flex
          w="full"
          flexDir={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 6 }}
          px={{ base: 3, md: 0 }}
          py={{ base: 3, md: 0 }}
        >
          <Text w="full" whiteSpace="pre-wrap" overflowWrap="anywhere">
            {term.word}
          </Text>
          <Box
            bg="gray.200"
            _dark={{
              bg: "gray.600",
            }}
            h="full"
            rounded="full"
            w="4px"
          />
          <Text w="full" whiteSpace="pre-wrap" overflowWrap="anywhere">
            {term.definition}
          </Text>
          <Box minW="100px">
            {term.assetUrl && <Box height="80px" mt={{ base: 3, md: 0 }} />}
          </Box>
        </Flex>
        <Box
          h="full"
          px={{ base: 1, md: 0 }}
          py={{ base: 2, md: 0 }}
          borderBottomWidth={{ base: 2, md: 0 }}
          borderBottomColor={{ base: "gray.100", md: "none" }}
          _dark={{
            borderBottomColor: { base: "gray.700", md: "none" },
          }}
        >
          <HStack
            spacing={1}
            height="24px"
            justifyContent={{ base: "space-between", md: "end" }}
            w="full"
            color="blue.600"
            _dark={{
              color: "blue.200",
            }}
          >
            {creator && (
              <Center w="8" h="8">
                <IconEditCircle size={18} />
              </Center>
            )}
            <Center w="8" h="8">
              <IconStar size={18} />
            </Center>
          </HStack>
        </Box>
      </Flex>
    </Card>
  );
};

export const DeloadedTerm = React.memo(DeloadedTermRaw);
