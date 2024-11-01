import {
  Divider,
  Flex,
  Heading,
  SkeletonText,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { useProfile } from "../../hooks/use-profile";
import { groupIntoTimeline } from "../../utils/groupings";
import { ProfileLinkable } from "./profile-linkable";

export const StudySetsList = () => {
  const profile = useProfile()!;
  const grouped = groupIntoTimeline(profile.studySets);

  const dividerColor = useColorModeValue("gray.300", "gray.700");
  const grayText = useColorModeValue("gray.600", "gray.400");

  const placeholder = !profile.isMe
    ? "This user doesn't have any public study sets."
    : "You haven't created any study sets yet.";

  // Check if the logged-in user is the official account
  const isOfficialAccount = profile.id === "cm2rrquuf0000ld03p035i1q1"; //! OFFICIAL QUIZFUZE USER ID

  // If the logged-in user is the official account, show their flashcards
  if (profile.isMe && isOfficialAccount) {
    return (
      <Stack spacing={8}>
        <Heading size="lg">Your Flashcards</Heading>
        {grouped.length > 0 ? (
          grouped.map((x, i) => (
            <Stack spacing={6} key={i}>
              <Flex gap={4} alignItems="center">
                <Heading fontSize="2xl" whiteSpace="nowrap">
                  {x.label}
                </Heading>
                <Divider borderColor={dividerColor} />
              </Flex>
              <Stack spacing={4}>
                {x.items.map((item) => (
                  <ProfileLinkable
                    key={item.id}
                    title={item.title}
                    url={`/${item.id}`}
                    visibility={item.visibility}
                    numValues={item._count.terms}
                    label="term"
                  />
                ))}
              </Stack>
            </Stack>
          ))
        ) : (
          <Stack>
            <Heading size="lg">Nothing yet</Heading>
            <Text color={grayText}>{placeholder}</Text>
          </Stack>
        )}
      </Stack>
    );
  }

  // If another user tries to access the official account
  if (isOfficialAccount && !profile.isMe) {
    return (
      <Stack spacing={8}>
        <Heading size="lg">Quizfuze Official Account</Heading>
        <Text color={grayText}>
          Thank you for using our platform! You found the official Quizfuze account!
        </Text>
      </Stack>
    );
  }

  // For normal users, show their own flashcards
  if (profile.studySets.length > 0) {
    return (
      <Stack spacing={8}>
        {grouped.map((x, i) => (
          <Stack spacing={6} key={i}>
            <Flex gap={4} alignItems="center">
              <Heading fontSize="2xl" whiteSpace="nowrap">
                {x.label}
              </Heading>
              <Divider borderColor={dividerColor} />
            </Flex>
            <Stack spacing={4}>
              {x.items.map((item) => (
                <ProfileLinkable
                  key={item.id}
                  title={item.title}
                  url={`/${item.id}`}
                  visibility={item.visibility}
                  numValues={item._count.terms}
                  label="term"
                />
              ))}
            </Stack>
          </Stack>
        ))}
        {!grouped.length && (
          <Stack>
            <Heading size="lg">Nothing yet</Heading>
            <Text color={grayText}>{placeholder}</Text>
          </Stack>
        )}
      </Stack>
    );
  }

  // Default message for users without study sets
  return (
    <Stack spacing={8}>
      <Heading size="lg">Nothing to show</Heading>
      <Text color={grayText}>{placeholder}</Text>
    </Stack>
  );
};

StudySetsList.Skeleton = function StudySetsListSkeleton() {
  const dividerColor = useColorModeValue("gray.300", "gray.700");

  const Group = ({
    heading,
    numSets,
  }: {
    heading: string;
    numSets: number;
  }) => (
    <Stack spacing={6}>
      <Flex gap={4} alignItems="center">
        <Flex h="28.8px" alignItems="center">
          <SkeletonText
            noOfLines={1}
            skeletonHeight="26px"
            rounded="md"
            overflow="hidden"
          >
            <Heading fontSize="2xl" whiteSpace="nowrap">
              {heading}
            </Heading>
          </SkeletonText>
        </Flex>
        <Divider borderColor={dividerColor} />
      </Flex>
      <Stack spacing={4}>
        {Array.from({ length: numSets }, (_, i) => (
          <ProfileLinkable.Skeleton key={i} />
        ))}
      </Stack>
    </Stack>
  );

  return (
    <Stack spacing={8}>
      <Group heading="Today" numSets={3} />
      <Group heading="Yesterday" numSets={5} />
    </Stack>
  );
};
