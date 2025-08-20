// components/TeamCard.tsx
import { Box, Text, VStack } from "@chakra-ui/react";
import type { Team } from "@/types/types";
import PlayerCard from "./PlayerCard";

interface Props {
  team: Team;
}

export default function TeamCard({ team }: Props) {
  return (
    <Box borderWidth="1px" borderRadius="md" p={2} w="full">
      <Text fontWeight="bold">Team Score: {team.score}</Text>
      <VStack align="stretch" mt={2}>
        {team.players.map((player) => (
          <PlayerCard key={player.id} player={player} />
        ))}
      </VStack>
    </Box>
  );
}
