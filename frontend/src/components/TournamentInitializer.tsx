import { useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
} from "@chakra-ui/react";
import type { Tournament } from "@/types/types";
import AdminPasswordPrompt from "@/components/AdminPasswordPrompt";

interface TournamentInitializerProps {
  tournament: Tournament;
  onTournamentInitialized: (tournament: Tournament) => void;
}

export default function TournamentInitializer({ tournament, onTournamentInitialized }: TournamentInitializerProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const canInitialize = () => {
    return (
      tournament.registered_players?.length >= 4 && 
      tournament.rounds?.length === 0
    );
  };

  const handleInitialize = async () => {
    setLoading(true);
    setMessage(null);
    setShowPasswordPrompt(false);

    try {
      const response = await fetch(`/api/tournament/${tournament.id}/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(errorData || "Failed to initialize tournament");
      }

      const updatedTournament = await response.json();
      onTournamentInitialized(updatedTournament);
      
      setMessage({
        type: 'success',
        text: `Tournament initialized successfully with ${tournament.rounds_count} rounds!`
      });
      setShowConfirm(false);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : "Failed to initialize tournament. Please try again."
      });
    } finally {
      setLoading(false);
    }
  };

  // Don't render if tournament is already initialized
  if (tournament.rounds && tournament.rounds.length > 0) {
    return (
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        p={4}
        borderColor="green.200"
        _dark={{ borderColor: "green.600", bg: "green.900" }}
        bg="green.50"
      >
        <HStack justify="space-between">
          <Text color="green.700" _dark={{ color: "green.200" }} fontWeight="medium">
            ✓ Tournament Initialized
          </Text>
          <Text fontSize="sm" color="green.600" _dark={{ color: "green.300" }}>
            {tournament.rounds.length} rounds created
          </Text>
        </HStack>
      </Box>
    );
  }

  if (!canInitialize()) {
    return (
      <Box 
        borderWidth="1px" 
        borderRadius="lg" 
        p={4}
        borderColor="blue.200"
        _dark={{ borderColor: "blue.600", bg: "gray.800" }}
        bg="blue.50"
      >
        <VStack align="start" gap={2}>
          <Text fontWeight="medium" color="blue.700" _dark={{ color: "blue.200" }}>
            ℹ️ Tournament cannot be initialized yet
          </Text>
          <Text fontSize="sm" color="blue.600" _dark={{ color: "blue.300" }}>
            Need at least 4 registered players. Currently have: {tournament.registered_players?.length || 0}
          </Text>
        </VStack>
      </Box>
    );
  }

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
      <VStack gap={4}>
        {!showConfirm ? (
          <>
            <Text color="gray.800" _dark={{ color: "white" }} fontWeight="medium" textAlign="center">
              Ready to Initialize Tournament
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }} textAlign="center">
              This will create {tournament.rounds_count} rounds with matches for {tournament.registered_players?.length} players
            </Text>
            <Button
              onClick={() => setShowPasswordPrompt(true)}
              colorScheme="orange"
              size="sm"
              variant="outline"
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s"
            >
              Initialize Tournament
            </Button>
          </>
        ) : (
          <>
            <Text color="orange.700" _dark={{ color: "orange.200" }} fontWeight="medium" textAlign="center">
              ⚠️ Confirm Initialization
            </Text>
            <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.300" }} textAlign="center">
              This action cannot be undone. The tournament will be initialized with:
            </Text>
            <VStack fontSize="sm" color="gray.700" _dark={{ color: "gray.200" }} gap={1}>
              <Text>• {tournament.rounds_count} rounds</Text>
              <Text>• {Math.max(1, Math.floor((tournament.registered_players?.length || 0) / 4))} matches per round</Text>
              <Text>• All scores set to 0:0 initially</Text>
            </VStack>
            <HStack gap={2}>
              <Button
                onClick={handleInitialize}
                colorScheme="orange"
                size="sm"
                loading={loading}
                disabled={loading}
              >
                {loading ? "Initializing..." : "Yes, Initialize"}
              </Button>
              <Button
                onClick={() => setShowConfirm(false)}
                variant="outline"
                size="sm"
                disabled={loading}
              >
                Cancel
              </Button>
            </HStack>
          </>
        )}

        {message && (
          <Text color={message.type === 'success' ? 'green.500' : message.type === 'error' ? 'red.500' : 'blue.500'}>
            {message.text}
          </Text>
        )}
      </VStack>
    </Box>
    
    {showPasswordPrompt && (
      <AdminPasswordPrompt
        title="Initialize Tournament"
        description={`This will create ${tournament.rounds_count} rounds with matches for ${tournament.registered_players?.length} registered players. This action requires admin authorization.`}
        confirmButtonText="Initialize Tournament"
        confirmButtonColor="orange"
        onConfirm={handleInitialize}
        onCancel={() => setShowPasswordPrompt(false)}
        isLoading={loading}
      />
    )}
  </>
  );
}