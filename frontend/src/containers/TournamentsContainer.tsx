// containers/TournamentsContainer.tsx
import { useEffect, useState } from "react";
import { Spinner, Center, VStack, Text, Button, Box } from "@chakra-ui/react";
import type { Tournament } from "@/types/types";
import TournamentsList from "@/components/TournamentsList";
import TournamentCreationForm from "@/components/TournamentCreationForm";
import CenteredContainer from "@/components/ui/CenteredContainer";

export default function TournamentsContainer() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    void fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/tournament");

      if (!response.ok) {
        throw new Error(`Failed to load tournaments (status ${response.status})`);
      }

      const data = await response.json();

      if (!Array.isArray(data)) {
        throw new Error("Unexpected response format from server");
      }

      setTournaments(data);
    } catch (err) {
      console.error("Error fetching tournaments:", err);
      setTournaments([]);
      setError(err instanceof Error ? err.message : "Failed to load tournaments");
    } finally {
      setLoading(false);
    }
  };

  const handleTournamentCreated = (tournament: Tournament) => {
    setTournaments((prev: Tournament[]) => [tournament, ...prev]);
    setShowCreateForm(false); // Hide the form after successful creation
  };

  const handleTournamentDeleted = (tournamentId: string) => {
    setTournaments((prev: Tournament[]) => prev.filter((tournament) => tournament.id !== tournamentId));
  };

  if (loading) {
    return (
      <CenteredContainer>
        <Center h="300px">
          <VStack gap={4}>
            <Spinner size="xl" color="blue.400" />
            <Text color="gray.400" fontSize="lg">
              Loading tournaments...
            </Text>
          </VStack>
        </Center>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <VStack gap={6}>
        {error ? (
          <Box w="100%" p={6} borderWidth="1px" borderRadius="lg" borderColor="red.300">
            <VStack gap={2}>
              <Text color="red.500" fontWeight="semibold">
                {"Couldn't load tournaments"}
              </Text>
              <Text color="red.400" fontSize="sm" textAlign="center">
                {error}
              </Text>
              <Button size="sm" colorScheme="red" variant="outline" onClick={fetchTournaments}>
                Retry
              </Button>
            </VStack>
          </Box>
        ) : (
          <TournamentsList 
            tournaments={tournaments} 
            onTournamentDeleted={handleTournamentDeleted}
          />
        )}
        
        <Box w="100%">
          <VStack gap={4}>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              variant={showCreateForm ? "solid" : "outline"}
              colorScheme="blue"
              size="sm"
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s"
            >
              {showCreateForm ? "Cancel" : "+ Create Tournament"}
            </Button>
            
            {showCreateForm && (
              <Box w="100%">
                <TournamentCreationForm onTournamentCreated={handleTournamentCreated} />
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </CenteredContainer>
  );
}
