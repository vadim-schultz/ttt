// components/MatchCard.tsx
import { useState, useEffect } from "react";
import { 
  Box, 
  HStack, 
  VStack, 
  Text, 
  Button, 
  Input,
  Flex,
  Separator
} from "@chakra-ui/react";
import type { Match } from "@/types/types";

interface Props {
  match: Match;
  onScoreUpdate?: (matchId: string, teamScores: number[], teamIds: string[]) => Promise<void>;
}

export default function MatchCard({ match, onScoreUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Sort teams consistently by team ID to ensure consistent ordering
  const sortedTeams = [...match.teams].sort((a, b) => a.id.localeCompare(b.id));
  
  const [editingScores, setEditingScores] = useState<number[]>(
    sortedTeams.map(team => team.score)
  );
  const [isLoading, setIsLoading] = useState(false);

  // Update editing scores when match data changes
  useEffect(() => {
    setEditingScores(sortedTeams.map(team => team.score));
  }, [match.teams]);

  const handleSaveScores = async () => {
    if (!onScoreUpdate) return;
    
    setIsLoading(true);
    try {
      // Use sorted team IDs and corresponding scores to maintain consistency
      const sortedTeamIds = sortedTeams.map(team => team.id);
      await onScoreUpdate(match.id, editingScores, sortedTeamIds);
      setIsEditing(false);
      // Simple success feedback - could be enhanced with toast system
      console.log("Scores updated successfully");
    } catch (error) {
      console.error("Failed to update scores:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setEditingScores(sortedTeams.map(team => team.score));
    setIsEditing(false);
  };

  const handleScoreChange = (teamIndex: number, value: string) => {
    const numValue = parseInt(value) || 0;
    const newScores = [...editingScores];
    newScores[teamIndex] = numValue;
    setEditingScores(newScores);
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
      {/* Match Header */}
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

      {/* Teams Display */}
      <VStack gap={3} align="stretch">
        {/* First Team */}
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
                      value={editingScores[0] || ''}
                      onChange={(e) => handleScoreChange(0, e.target.value)}
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
                  <Text fontSize="sm" color="gray.400">pts</Text>
                </HStack>
              </Flex>
              
              {/* Players */}
              <VStack align="stretch" gap={1}>
                {sortedTeams[0].players.map((player) => (
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

        {/* VS Divider */}
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

        {/* Second Team */}
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
                      value={editingScores[1] || ''}
                      onChange={(e) => handleScoreChange(1, e.target.value)}
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
                  <Text fontSize="sm" color="gray.400">pts</Text>
                </HStack>
              </Flex>
              
              {/* Players */}
              <VStack align="stretch" gap={1}>
                {sortedTeams[1].players.map((player) => (
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

      {/* Edit Controls */}
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
