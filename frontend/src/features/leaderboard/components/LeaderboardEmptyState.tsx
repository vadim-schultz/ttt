import { Box, Text } from "@chakra-ui/react";

export default function LeaderboardEmptyState() {
  return (
    <Box
      bg="gray.800"
      borderRadius="lg"
      p={8}
      border="1px solid"
      borderColor="gray.600"
      textAlign="center"
    >
      <Text color="gray.400" fontSize="lg">
        No players found in the leaderboard
      </Text>
    </Box>
  );
}
