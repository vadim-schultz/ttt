// components/MatchCard.tsx
import { Box, Heading, HStack, Text } from "@chakra-ui/react";
import type { Match } from "@/types/types";
import TeamCard from "./TeamCard";

interface Props {
  match: Match;
}

export default function MatchCard({ match }: Props) {
  return (
    <Box borderWidth="1px" borderRadius="lg" p={3} mb={3}>
      <Heading size="sm">Match</Heading>
      <Text>Total Score: {match.score}</Text>
      <HStack mt={2}>
        {match.teams.map((team) => (
          <TeamCard key={team.id} team={team} />
        ))}
      </HStack>
    </Box>
  );
}
