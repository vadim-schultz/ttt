import { useState, type KeyboardEvent, type MouseEvent } from "react";
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
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import AdminPasswordPrompt from "@/components/AdminPasswordPrompt";
import type { Tournament } from "@/features/shared/types";

interface TournamentsListProps {
  tournaments: Tournament[];
  onDelete: (tournamentId: string) => Promise<void>;
}

export default function TournamentsList({
  tournaments,
  onDelete,
}: TournamentsListProps) {
  const navigate = useNavigate();
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);
  const [tournamentToDelete, setTournamentToDelete] =
    useState<Tournament | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleTournamentClick = (tournamentId: string) => {
    navigate(`/tournament/${tournamentId}`);
  };

  const handleDeleteClick = (
    event: MouseEvent<HTMLButtonElement>,
    tournament: Tournament
  ) => {
    event.stopPropagation();
    setTournamentToDelete(tournament);
    setErrorMessage(null);
    setShowPasswordPrompt(true);
  };

  const handlePasswordConfirmed = async () => {
    if (!tournamentToDelete) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      await onDelete(tournamentToDelete.id);
      setShowPasswordPrompt(false);
      setTournamentToDelete(null);
    } catch (error) {
      console.error("Error deleting tournament:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete tournament"
      );
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
      <Heading size="lg" mb={6} textAlign="center">
        Tournaments
      </Heading>

      {errorMessage && (
        <Box
          w="100%"
          p={4}
          borderWidth="1px"
          borderRadius="lg"
          borderColor="red.300"
          mb={4}
        >
          <Text color="red.200" textAlign="center">
            {errorMessage}
          </Text>
        </Box>
      )}

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
            cursor="pointer"
            onClick={() => handleTournamentClick(tournament.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
              if (event.key === "Enter" || event.key === " ") {
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
                  <Badge
                    colorScheme={
                      tournament.status === "active" ? "green" : "gray"
                    }
                  >
                    {tournament.status}
                  </Badge>
                </Box>
              </HStack>

              <Text color="gray.600">
                Start Date:{" "}
                {new Date(tournament.start_date).toLocaleDateString()}
              </Text>

              <Text color="gray.600">Rounds: {tournament.rounds_count}</Text>
            </VStack>

            <IconButton
              aria-label={`Delete tournament ${tournament.name}`}
              size="sm"
              colorScheme="red"
              variant="ghost"
              position="absolute"
              top={2}
              right={2}
              onClick={(event: MouseEvent<HTMLButtonElement>) =>
                handleDeleteClick(event, tournament)
              }
              _hover={{ bg: "red.50", color: "red.600" }}
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
