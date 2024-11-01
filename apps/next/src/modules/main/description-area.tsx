import { Link } from "@quenti/components";
import { avatarUrl } from "@quenti/lib/avatar";

import {
  Avatar,
  Box,
  Flex,
  HStack,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconDiscountCheck } from "@tabler/icons-react";

import { useSet } from "../../hooks/use-set";
import { ActionArea } from "./action-area";

export const DescriptionArea = () => {
  const { description, user } = useSet();
  const highlight = useColorModeValue("blue.500", "blue.200");

  // Check if the user ID is not equal to the specified ID
  const shouldRenderHStack = user && user.id !== "cm2rrquuf0000ld03p035i1q1"; //! OFFICIAL QUIZFUZE USER ID

  return (
    <Stack spacing={8}>
      <Flex
        justifyContent={{ base: "start", sm: "space-between" }}
        flexDir={{ base: "column", sm: "row" }}
        gap={{ base: 8, sm: 0 }}
      >
        {/* Conditionally render HStack and its contents */}
        {shouldRenderHStack ? (
          <HStack spacing={4}>
            {/* Avatar area for flashcard sets */}
            <Avatar src={avatarUrl(user)} size="md" className="highlight-block" />
            <Stack spacing={0}>
              <HStack spacing="2">
                <Link
                  fontWeight={700}
                  href={`/@${user.username}`}
                  transition="color 0.2s ease-in-out"
                  _hover={{ color: highlight }}
                  className="highlight-block"
                >
                  {user.username}
                </Link>
                {user.verified && (
                  <Box color="blue.300">
                    <Tooltip label="Verified">
                      <IconDiscountCheck size={20} aria-label="Verified" />
                    </Tooltip>
                  </Box>
                )}
              </HStack>
              {user.name && (
                <Text fontSize="sm" color="gray.500" fontWeight={600}>
                  {user.name}
                </Text>
              )}
            </Stack>
          </HStack>
        ) : (
          <HStack spacing={4}></HStack>
        )}
        
        <ActionArea />
      </Flex>
      <Text whiteSpace="pre-wrap">{description}</Text>
    </Stack>
  );
};
