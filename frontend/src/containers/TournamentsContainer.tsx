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
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = () => {
    fetch("/api/")
      .then((res) => res.json())
      .then((data) => setTournaments(data))
      .finally(() => setLoading(false));
  };

  const handleTournamentCreated = (tournament: Tournament) => {
    setTournaments(prev => [tournament, ...prev]);
    setShowCreateForm(false); // Hide the form after successful creation
  };

  const handleTournamentDeleted = (tournamentId: string) => {
    setTournaments(prev => prev.filter(tournament => tournament.id !== tournamentId));
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
        <TournamentsList 
          tournaments={tournaments} 
          onTournamentDeleted={handleTournamentDeleted}
        />
        
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
