import { HStack, Heading, Stack, Text } from "@chakra-ui/react";
import { IconClock } from "@tabler/icons-react";  // Changed icon import

export const EmptyStudentsCard = () => {
  return (
    <Stack>
      <HStack spacing="4">
        <IconClock size={32} /> {/* Changed the icon */}
        <Heading>Coming soon</Heading> {/* Changed the text */}
      </HStack>
      <Text color="gray.500">
        Coming soon...
      </Text>
    </Stack>
  );
};
