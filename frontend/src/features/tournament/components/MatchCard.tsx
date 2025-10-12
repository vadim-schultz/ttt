import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import {
  Box,
  HStack,
  VStack,
  Text,
  Button,
  Input,
  Flex,
  Separator,
} from "@chakra-ui/react";
import type { Match, Player, Team } from "@/features/shared/types";

interface MatchCardProps {
  match: Match;
  onScoreUpdate?: (
    matchId: string,
    teamScores: number[],
    teamIds: string[]
  ) => Promise<void>;
}

export default function MatchCard({ match, onScoreUpdate }: MatchCardProps) {
  const sortedTeams = useMemo<Team[]>(
    () => [...match.teams].sort((a, b) => a.id.localeCompare(b.id)),
    [match.teams]
  );
  const [editingScores, setEditingScores] = useState<number[]>(
    sortedTeams.map((team) => team.score)
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setEditingScores(sortedTeams.map((team) => team.score));
  }, [sortedTeams]);

  const handleSaveScores = async () => {
    if (!onScoreUpdate) return;

    setIsLoading(true);
    try {
      const sortedTeamIds = sortedTeams.map((team) => team.id);
      await onScoreUpdate(match.id, editingScores, sortedTeamIds);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update scores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingScores(sortedTeams.map((team) => team.score));
    setIsEditing(false);
  };

  const handleScoreChange =
    (teamIndex: number) => (event: ChangeEvent<HTMLInputElement>) => {
      const numValue = Number.parseInt(event.target.value, 10) || 0;
      setEditingScores((prev: number[]) => {
        const nextScores = [...prev];
        nextScores[teamIndex] = numValue;
        return nextScores;
      });
    };

  return (
    <Box
      bg="gray.800"
      borderWidth="1px"
      borderColor="gray.600"
      borderRadius="lg"
      p={4}
      _hover={{ borderColor: "gray.500", bg: "gray.750" }}
      transition="all 0.2s"
    >
      <Flex justify="space-between" align="center" mb={4}>
        <Text fontSize="sm" fontWeight="medium" color="gray.400">
          Match #{match.teams[0]?.id.slice(-4)}
        </Text>
        {onScoreUpdate && !isEditing && (
          <Button
            size="sm"
            variant="ghost"
            colorScheme="blue"
            onClick={() => setIsEditing(true)}
          >
            Edit
          </Button>
        )}
      </Flex>

      <VStack gap={3} align="stretch">
        {sortedTeams.length > 0 && (
          <Box key={sortedTeams[0].id}>
            <Box
              bg="gray.700"
              borderRadius="md"
              p={3}
              border="1px solid"
              borderColor="gray.600"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" fontWeight="semibold" color="blue.300">
                  Team 1
                </Text>
                <HStack gap={2}>
                  {isEditing ? (
                    <Input
                      size="sm"
                      width="80px"
                      type="number"
                      min="0"
                      value={editingScores[0] ?? ""}
                      onChange={handleScoreChange(0)}
                      bg="gray.600"
                      borderColor="gray.500"
                      _focus={{ borderColor: "blue.400", bg: "gray.500" }}
                      color="white"
                    />
                  ) : (
                    <Text fontSize="lg" fontWeight="bold" color="green.400">
                      {sortedTeams[0].score}
                    </Text>
                  )}
                  <Text fontSize="sm" color="gray.400">
                    pts
                  </Text>
                </HStack>
              </Flex>

              <VStack align="stretch" gap={1}>
                {sortedTeams[0].players.map((player: Player) => (
                  <Flex key={player.id} justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.200">
                      {player.name}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      ({player.cumulative_score} total)
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          </Box>
        )}

        <Flex align="center" justify="center" my={1}>
          <Separator borderColor="gray.600" />
          <Text
            mx={3}
            fontSize="xs"
            fontWeight="bold"
            color="gray.500"
            bg="gray.800"
            px={2}
          >
            VS
          </Text>
          <Separator borderColor="gray.600" />
        </Flex>

        {sortedTeams.length > 1 && (
          <Box key={sortedTeams[1].id}>
            <Box
              bg="gray.700"
              borderRadius="md"
              p={3}
              border="1px solid"
              borderColor="gray.600"
            >
              <Flex justify="space-between" align="center" mb={2}>
                <Text fontSize="sm" fontWeight="semibold" color="blue.300">
                  Team 2
                </Text>
                <HStack gap={2}>
                  {isEditing ? (
                    <Input
                      size="sm"
                      width="80px"
                      type="number"
                      min="0"
                      value={editingScores[1] ?? ""}
                      onChange={handleScoreChange(1)}
                      bg="gray.600"
                      borderColor="gray.500"
                      _focus={{ borderColor: "blue.400", bg: "gray.500" }}
                      color="white"
                    />
                  ) : (
                    <Text fontSize="lg" fontWeight="bold" color="green.400">
                      {sortedTeams[1].score}
                    </Text>
                  )}
                  <Text fontSize="sm" color="gray.400">
                    pts
                  </Text>
                </HStack>
              </Flex>

              <VStack align="stretch" gap={1}>
                {sortedTeams[1].players.map((player: Player) => (
                  <Flex key={player.id} justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.200">
                      {player.name}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      ({player.cumulative_score} total)
                    </Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          </Box>
        )}
      </VStack>

      {isEditing && (
        <Flex justify="flex-end" gap={2} mt={4}>
          <Button
            size="sm"
            variant="ghost"
            colorScheme="red"
            onClick={handleCancelEdit}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            colorScheme="green"
            onClick={handleSaveScores}
            loading={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </Flex>
      )}
    </Box>
  );
}
