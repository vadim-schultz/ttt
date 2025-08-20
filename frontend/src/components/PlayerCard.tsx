// components/PlayerCard.tsx
import { Box, Text } from "@chakra-ui/react";
import type { Player } from "@/types/types";

interface Props {
  player: Player;
}

export default function PlayerCard({ player }: Props) {
  return (
    <Box borderWidth="1px" borderRadius="md" p={2}>
      <Text>{player.name}</Text>
      <Text fontSize="sm" color="gray.500">
        Cumulative: {player.cumulative_score}
      </Text>
    </Box>
  );
}
