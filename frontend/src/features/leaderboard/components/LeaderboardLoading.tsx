import { Center, Spinner, Text, VStack } from "@chakra-ui/react";
import { CenteredContainer } from "@/shared/ui";

export default function LeaderboardLoading() {
  return (
    <CenteredContainer>
      <Center h="300px">
        <VStack gap={4}>
          <Spinner size="xl" color="blue.400" />
          <Text color="gray.400" fontSize="lg">
            Loading leaderboard...
          </Text>
        </VStack>
      </Center>
    </CenteredContainer>
  );
}
