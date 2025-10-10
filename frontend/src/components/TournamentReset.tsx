import { useState } from "react";
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Heading,
} from "@chakra-ui/react";
import type { Tournament } from "@/types/types";
import AdminPasswordPrompt from "@/components/AdminPasswordPrompt";

interface TournamentResetProps {
  tournament: Tournament;
  onTournamentReset: (tournament: Tournament) => void;
}

export default function TournamentReset({ tournament, onTournamentReset }: TournamentResetProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const canReset = () => {
    return tournament.rounds && tournament.rounds.length > 0;
  };

  const handleReset = async () => {
    setLoading(true);
    setMessage(null);
    setShowConfirm(false);
    setShowPasswordPrompt(false);

    try {
      const response = await fetch(`/api/tournament/${tournament.id}/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reset tournament');
      }

      const updatedTournament = await response.json();
      
      setMessage({ 
        type: 'success', 
        text: `Tournament "${tournament.name}" has been reset successfully! You can now re-initialize it with the registered players.` 
      });
      
      onTournamentReset(updatedTournament);
      
    } catch (error) {
      console.error('Error resetting tournament:', error);
      setMessage({ 
        type: 'error', 
        text: 'Failed to reset tournament. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!canReset()) {
    return null; // Don't show anything if there are no rounds to reset
  }

  return (
    <>
      <Box 
        p={6} 
        bg="red.900" 
        borderRadius="lg" 
        border="1px solid"
      borderColor="red.600"
      _dark={{ bg: "red.900", borderColor: "red.600" }}
    >
      <VStack gap={4} align="stretch">
        <Box>
          <Heading size="md" color="red.100" mb={2}>
            Reset Tournament
          </Heading>
          <Text color="red.200" fontSize="sm">
            This will remove all rounds, matches, and scores while keeping the tournament and registered players intact. 
            The tournament can be re-initialized afterwards.
          </Text>
        </Box>

        {message && (
          <Box
            p={3}
            borderRadius="md"
            bg={message.type === 'success' ? 'green.700' : 'red.700'}
            borderColor={message.type === 'success' ? 'green.500' : 'red.500'}
            borderWidth="1px"
          >
            <Text color={message.type === 'success' ? 'green.100' : 'red.100'} fontSize="sm">
              {message.text}
            </Text>
          </Box>
        )}

        {!showConfirm ? (
          <Button
            colorScheme="red"
            variant="outline"
            size="sm"
            onClick={() => setShowPasswordPrompt(true)}
            disabled={loading}
            _hover={{ bg: "red.800" }}
          >
            Reset Tournament
          </Button>
        ) : (
          <VStack gap={3} align="stretch">
            <Box
              p={3}
              bg="red.800"
              borderRadius="md"
              border="1px solid"
              borderColor="red.600"
            >
              <Text color="red.100" fontSize="sm" fontWeight="bold" mb={2}>
                ⚠️ Are you absolutely sure?
              </Text>
              <Text color="red.200" fontSize="xs">
                This action will permanently delete all rounds, matches, and scores. 
                Only the tournament details and registered players will be preserved.
              </Text>
            </Box>
            
            <HStack justify="space-between">
              <Button
                size="sm"
                variant="outline"
                colorScheme="gray"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                colorScheme="red"
                onClick={handleReset}
                loading={loading}
              >
                {loading ? "Resetting..." : "Yes, Reset Tournament"}
              </Button>
            </HStack>
          </VStack>
        )}

        {canReset() && (
          <Box>
            <Text color="red.300" fontSize="xs">
              Current state: {tournament.rounds?.length || 0} rounds, 
              {tournament.rounds?.reduce((total, round) => total + (round.matches?.length || 0), 0) || 0} matches
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
      
      {showPasswordPrompt && (
        <AdminPasswordPrompt
          title="Reset Tournament"
          description={`This will permanently delete all ${tournament.rounds?.length || 0} rounds and ${tournament.rounds?.reduce((total, round) => total + (round.matches?.length || 0), 0) || 0} matches while preserving tournament details and registered players. This action requires admin authorization.`}
          confirmButtonText="Reset Tournament"
          confirmButtonColor="red"
          onConfirm={handleReset}
          onCancel={() => setShowPasswordPrompt(false)}
          isLoading={loading}
        />
      )}
    </>
  );
}