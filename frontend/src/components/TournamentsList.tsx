import {
  Box,
  VStack,
  Text,
  Stack,
  Heading,
  Badge,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import type { Tournament } from "@/types/types";
import AdminPasswordPrompt from "./AdminPasswordPrompt";

interface TournamentsListProps {
  tournaments: Tournament[];
  onTournamentDeleted?: (tournamentId: string) => void;
}

export default function TournamentsList({ tournaments, onTournamentDeleted }: TournamentsListProps) {
  const navigate = useNavigate();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(false);

  const handleTournamentClick = (tournamentId: string) => {
    navigate(`/tournament/${tournamentId}`);
  };

  const handleDeleteClick = (e: React.MouseEvent, tournament: Tournament) => {
    e.stopPropagation(); // Prevent triggering tournament navigation
    setTournamentToDelete(tournament);
    setShowPasswordPrompt(true);
  };

  const handlePasswordConfirmed = async () => {
    if (!tournamentToDelete) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/tournament/${tournamentToDelete.id}/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        onTournamentDeleted?.(tournamentToDelete.id);
        console.log('Tournament deleted successfully');
        setShowPasswordPrompt(false);
        setTournamentToDelete(null);
      } else {
        const errorData = await response.json();
        console.error('Failed to delete tournament:', errorData);
        throw new Error(errorData.detail || 'Failed to delete tournament');
      }
    } catch (error: any) {
      console.error('Error deleting tournament:', error);
      throw error; // Let AdminPasswordPrompt handle the error display
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordPrompt(false);
    setTournamentToDelete(null);
    setLoading(false);
  };

  return (
    <VStack align="stretch" w="100%" py="6">
      <Heading size="lg" mb={6} textAlign="center">Tournaments</Heading>
      <Stack gap={4} w="100%">
        {tournaments.map((tournament) => (
          <Box
            key={tournament.id}
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            shadow="sm"
            _hover={{ shadow: "md", borderColor: "teal.500" }}
            transition="all 0.2s"
            position="relative"
          >
            {/* Main tournament content - clickable */}
            <Box
              cursor="pointer"
              onClick={() => handleTournamentClick(tournament.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleTournamentClick(tournament.id);
                }
              }}
            >
              <VStack align="start" gap={3}>
                <HStack justify="space-between" w="100%">
                  <Box flex="1">
                    <Heading size="md" color="teal.600">
                      {tournament.name}
                    </Heading>
                    <Badge colorScheme={tournament.status === 'active' ? 'green' : 'gray'}>
                      {tournament.status}
                    </Badge>
                  </Box>
                </HStack>
                
                <Text color="gray.600">
                  Start Date: {new Date(tournament.start_date).toLocaleDateString()}
                </Text>
                
                <Text color="gray.600">
                  Rounds: {tournament.rounds_count}
                </Text>
              </VStack>
            </Box>

            {/* Delete button - positioned absolutely in top right */}
            <IconButton
              aria-label={`Delete tournament ${tournament.name}`}
              size="sm"
              colorScheme="red"
              variant="ghost"
              position="absolute"
              top={2}
              right={2}
              onClick={(e) => handleDeleteClick(e, tournament)}
              _hover={{ 
                bg: "red.50",
                color: "red.600"
              }}
            >
              <MdDelete />
            </IconButton>
          </Box>
        ))}
        {tournaments.length === 0 && (
          <Text color="gray.500" textAlign="center" py={8}>
            No tournaments available
          </Text>
        )}
      </Stack>

      {/* Admin Password Prompt for Tournament Deletion */}
      {showPasswordPrompt && tournamentToDelete && (
        <AdminPasswordPrompt
          title="Delete Tournament - Admin Authentication Required"
          description={`Please enter the admin password to permanently delete the tournament "${tournamentToDelete.name}". This action cannot be undone and will remove all tournament data including players, rounds, and matches.`}
          confirmButtonText="Delete Tournament"
          confirmButtonColor="red"
          onConfirm={handlePasswordConfirmed}
          onCancel={handlePasswordCancel}
          isLoading={loading}
        />
      )}
    </VStack>
  );
}
