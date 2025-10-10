import { Table, Box, Text, Flex, Badge, HStack } from "@chakra-ui/react";
import type { Player } from "@/types/types";

interface LeaderboardTableProps {
  players: Player[];
}

const getRankBadge = (rank: number) => {
  switch (rank) {
    case 1:
      return { emoji: "🏆", color: "yellow", text: "#1" };
    case 2:
      return { emoji: "🥈", color: "gray", text: "#2" };
    case 3:
      return { emoji: "🥉", color: "orange", text: "#3" };
    default:
      return { emoji: "", color: "blue", text: `#${rank}` };
  }
};

const getRowBackground = (rank: number) => {
  switch (rank) {
    case 1:
      return "yellow.900";
    case 2:
      return "gray.700";
    case 3:
      return "orange.900";
    default:
      return "gray.800";
  }
};

export default function LeaderboardTable({ players }: LeaderboardTableProps) {
  if (!players || players.length === 0) {
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

  return (
    <Box
      bg="gray.800"
      borderRadius="lg"
      overflow="hidden"
      border="1px solid"
      borderColor="gray.600"
      maxW="600px"
      mx="auto"
    >
      <Box
        bg="gray.700"
        px={6}
        py={4}
        borderBottom="1px solid"
        borderColor="gray.600"
      >
        <Flex align="center" gap={3}>
          <Text fontSize="xl" fontWeight="bold" color="white">
            🏆 Leaderboard
          </Text>
          <Badge colorPalette="blue" variant="surface">
            {players.length} Players
          </Badge>
        </Flex>
      </Box>

      <Table.Root bg="gray.800" colorPalette="gray" striped variant="outline">
        <Table.Header bg="gray.700">
          <Table.Row>
            <Table.ColumnHeader
              color="gray.300"
              fontWeight="semibold"
              fontSize="sm"
              textAlign="center"
              width="120px"
            >
              Rank
            </Table.ColumnHeader>
            <Table.ColumnHeader
              color="gray.300"
              fontWeight="semibold"
              fontSize="sm"
              textAlign="center"
            >
              Player
            </Table.ColumnHeader>
            <Table.ColumnHeader
              color="gray.300"
              fontWeight="semibold"
              fontSize="sm"
              textAlign="center"
              width="120px"
            >
              Score
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {players.map((player, idx) => {
            const rank = idx + 1;
            const badge = getRankBadge(rank);
            const rowBg = getRowBackground(rank);

            return (
              <Table.Row
                key={player.id}
                bg={rowBg}
                _hover={{ bg: rank <= 3 ? rowBg : "gray.750" }}
                transition="background-color 0.2s"
              >
                <Table.Cell textAlign="center" py={4}>
                  <HStack justify="center" gap={2}>
                    {badge.emoji && <Text fontSize="lg">{badge.emoji}</Text>}
                    <Badge
                      colorPalette={badge.color}
                      variant={rank <= 3 ? "solid" : "outline"}
                      size="sm"
                    >
                      {badge.text}
                    </Badge>
                  </HStack>
                </Table.Cell>
                <Table.Cell textAlign="center" py={4}>
                  <Text
                    color={rank <= 3 ? "white" : "gray.200"}
                    fontWeight={rank <= 3 ? "semibold" : "normal"}
                    fontSize="md"
                  >
                    {player.name}
                  </Text>
                </Table.Cell>
                <Table.Cell textAlign="center" py={4}>
                  <Text
                    color={
                      rank === 1
                        ? "yellow.300"
                        : rank <= 3
                        ? "white"
                        : "green.400"
                    }
                    fontWeight="bold"
                    fontSize="lg"
                  >
                    {player.cumulative_score}
                  </Text>
                  <Text color="gray.400" fontSize="xs">
                    points
                  </Text>
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table.Root>
    </Box>
  );
}
