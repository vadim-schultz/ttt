import { useState } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  HStack,
  Button,
} from "@chakra-ui/react";
import AdminPasswordPrompt from "@/components/AdminPasswordPrompt";
import type { Player } from "@/types/types";

interface RegisteredPlayersListProps {
  players: Player[];
  tournamentId: string;
  onPlayerRemoved: () => void;
  canRemovePlayers?: boolean;
}

export default function RegisteredPlayersList({ 
  players, 
  tournamentId, 
  onPlayerRemoved, 
  canRemovePlayers = true 
}: RegisteredPlayersListProps) {
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);

  const handleDeleteClick = (player: Player) => {
    setSelectedPlayer(player);
    setShowPasswordPrompt(true);
  };

  const handlePasswordConfirmed = async () => {
    if (!selectedPlayer) return;

    setIsRemoving(true);
    try {
      const response = await fetch(
        `/api/tournament/${tournamentId}/remove-player/${selectedPlayer.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to remove player");
      }

      // Success - refresh the tournament data
      onPlayerRemoved();
    } catch (error) {
      console.error("Error removing player:", error);
      // In a production app, you might want to show a toast notification here
      alert(`Error: ${error instanceof Error ? error.message : "Failed to remove player"}`);
    } finally {
      setIsRemoving(false);
      setSelectedPlayer(null);
      setShowPasswordPrompt(false);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordPrompt(false);
    setSelectedPlayer(null);
  };

  return (
    <>
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        p={6}
        borderColor="gray.200"
        _dark={{ borderColor: "gray.600", bg: "gray.800" }}
        bg="white"
      >
        <Heading size="md" mb={4} color="gray.800" _dark={{ color: "white" }}>
          Registered Players
        </Heading>
        
        {!canRemovePlayers && (
          <Text fontSize="sm" color="orange.600" _dark={{ color: "orange.400" }} mb={3} textAlign="center">
            Players cannot be removed from an initialized tournament. Reset the tournament first to remove players.
          </Text>
        )}
        
        {players.length === 0 ? (
          <Text color="gray.500" _dark={{ color: "gray.400" }} textAlign="center" py={4}>
            No players registered yet
          </Text>
        ) : (
          <VStack align="stretch" gap={2}>
            {players.map((player) => (
              <Box
                key={player.id}
                borderWidth="1px"
                borderRadius="md"
                p={3}
                bg="gray.50"
                _dark={{ bg: "gray.700", borderColor: "gray.600" }}
                borderColor="gray.200"
                _hover={{ 
                  bg: "gray.100", 
                  _dark: { bg: "gray.600" }
                }}
                transition="background-color 0.2s"
              >
                <HStack justify="space-between">
                  <VStack align="start" gap={0} flex={1}>
                    <Text fontWeight="semibold" color="gray.800" _dark={{ color: "white" }}>
                      {player.name}
                    </Text>
                    <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }}>
                      {player.email}
                    </Text>
                  </VStack>
                  <HStack>
                    <Text fontSize="sm" color="blue.600" _dark={{ color: "blue.400" }} fontWeight="medium">
                      Score: {player.cumulative_score}
                    </Text>
                    {canRemovePlayers && (
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={() => handleDeleteClick(player)}
                        _hover={{ bg: "red.50", _dark: { bg: "red.900" } }}
                        aria-label={`Remove ${player.name} from tournament`}
                        title={`Remove ${player.name}`}
                        fontWeight="bold"
                        fontSize="lg"
                        minW="32px"
                        h="32px"
                      >
                        ×
                      </Button>
                    )}
                  </HStack>
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
        
        <Text fontSize="sm" color="gray.500" _dark={{ color: "gray.400" }} mt={4} textAlign="center">
          Total: {players.length} player{players.length !== 1 ? 's' : ''}
        </Text>
      </Box>

      {/* Admin Password Prompt */}
      {showPasswordPrompt && selectedPlayer && (
        <AdminPasswordPrompt
          title="Remove Player - Admin Authentication Required"
          description={`Please enter the admin password to remove "${selectedPlayer.name}" from this tournament. This action cannot be undone.`}
          confirmButtonText="Remove Player"
          confirmButtonColor="red"
          onConfirm={handlePasswordConfirmed}
          onCancel={handlePasswordCancel}
          isLoading={isRemoving}
        />
      )}
    </>
  );
}