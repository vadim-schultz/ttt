import { Spinner, Alert, Box, VStack, Text, Center } from "@chakra-ui/react";
import CenteredContainer from "@/components/ui/CenteredContainer";
import LeaderboardTable from "../components/LeaderboardTable";
import useLeaderboard from "../hooks/useLeaderboard";

export default function LeaderboardContainer() {
  const { players, loading, error } = useLeaderboard();

  if (loading) {
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

  if (error) {
    return (
      <CenteredContainer>
        <Alert.Root
          status="error"
          bg="red.900"
          borderColor="red.600"
          color="red.100"
        >
          <Alert.Indicator />
          <Box>
            <Alert.Title>Error Loading Leaderboard</Alert.Title>
            <Alert.Description>{error}</Alert.Description>
          </Box>
        </Alert.Root>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <VStack gap={6} align="stretch">
        <Box textAlign="center">
          <Text fontSize="3xl" fontWeight="bold" color="white" mb={2}>
            Global Leaderboard
          </Text>
          <Text color="gray.400" fontSize="lg">
            Tournament rankings across all competitions
          </Text>
        </Box>

        <LeaderboardTable players={players} />

        {players.length > 0 && (
          <Box textAlign="center" mt={4}>
            <Text color="gray.500" fontSize="sm">
              Last updated: {new Date().toLocaleString()}
            </Text>
          </Box>
        )}
      </VStack>
    </CenteredContainer>
  );
}
