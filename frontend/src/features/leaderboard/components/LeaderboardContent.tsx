import { Box, Text, VStack } from "@chakra-ui/react";
import type { Player } from "@/features/shared/types";
import type { ReactNode } from "react";
import { CenteredContainer } from "@/shared/ui";

interface Props {
  players: Player[];
  leaderboardView: ReactNode;
}

export default function LeaderboardContent({
  players,
  leaderboardView,
}: Props) {
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

        {leaderboardView}

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
