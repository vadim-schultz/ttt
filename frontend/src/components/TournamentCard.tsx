// components/TournamentDetail.tsx
import { Box, Heading, VStack } from "@chakra-ui/react";
import type { Tournament } from "@/types/types";

interface TournamentDetailProps {
  tournament: Tournament;
}

export default function TournamentDetail({ tournament }: TournamentDetailProps) {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg">
      <Heading size="md">Tournament {tournament.id}</Heading>
      <p>Status: {tournament.status}</p>
      <p>Start Date: {tournament.start_date}</p>
      <p>Rounds: {tournament.rounds_count}</p>

      <VStack align="stretch" mt={4}>
        {tournament.rounds.map((round) => (
          <Box key={round.id} borderWidth="1px" p={2} borderRadius="md">
            Round {round.round_number} ({round.matches.length} matches)
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
