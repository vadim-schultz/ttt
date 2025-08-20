// components/RoundCard.tsx
import { Box, Heading, VStack } from "@chakra-ui/react";
import type { Round } from "@/types/types";
import MatchCard from "./MatchCard";

interface Props {
  round: Round;
}

export default function RoundCard({ round }: Props) {
  return (
    <Box borderWidth="1px" borderRadius="xl" p={3} shadow="sm" mb={4}>
      <Heading size="md">Round {round.round_number}</Heading>
      <VStack align="stretch" mt={3}>
        {round.matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </VStack>
    </Box>
  );
}
