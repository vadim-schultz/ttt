import { useEffect, useState } from "react";
import { Tabs, Spinner, Heading, Text, Button, HStack, Center, VStack } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import type { Tournament, Player } from "@/types/types";
import TournamentSchedule from "@/components/TournamentSchedule";
import LeaderboardTable from "@/components/LeaderboardTable";
import PlayerRegistrationForm from "@/components/PlayerRegistrationForm";
import RegisteredPlayersList from "@/components/RegisteredPlayersList";
import TournamentDetailsCard from "@/components/TournamentDetailsCard";
import TournamentInitializer from "@/components/TournamentInitializer";
import TournamentReset from "@/components/TournamentReset";
import CenteredContainer from "@/components/ui/CenteredContainer";

export default function TournamentContainer() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [leaderboard, setLeaderboard] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTournamentData = async () => {
    if (!tournamentId) return;
    
    try {
      const [tournamentData, leaderboardData] = await Promise.all([
        fetch(`/api/tournament/${tournamentId}`).then(res => res.json()),
        fetch(`/api/tournament/${tournamentId}/leaderboard`).then(res => res.json())
      ]);
      
      setTournament(tournamentData);
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Failed to fetch tournament data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScoreUpdate = async (matchId: string, teamScores: number[], teamIds: string[]): Promise<void> => {
    if (!tournament) return;
    
    if (teamIds.length !== 2 || teamScores.length !== 2) {
      throw new Error('Invalid team structure - exactly 2 teams and scores required');
    }

    // Prepare form data for the backend API
    const formData = new FormData();
    formData.append('match_id', matchId);
    formData.append('team1_id', teamIds[0]);
    formData.append('team2_id', teamIds[1]);
    formData.append('team1_score', teamScores[0].toString());
    formData.append('team2_score', teamScores[1].toString());

    const response = await fetch('/api/score', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Failed to update scores');
    }
    
    // Refresh tournament data after successful update
    await fetchTournamentData();
  };

  const handlePlayerRegistered = (player: Player) => {
    // Add the player to the tournament's registered players
    if (tournament) {
      setTournament(prev => prev ? {
        ...prev,
        registered_players: [...(prev.registered_players || []), player]
      } : null);
    }
  };

  const handleTournamentInitialized = (updatedTournament: Tournament) => {
    setTournament(updatedTournament);
  };

  const handleTournamentReset = (updatedTournament: Tournament) => {
    setTournament(updatedTournament);
  };

  const handlePlayerRemoved = async () => {
    // Refresh tournament data after player removal
    await fetchTournamentData();
  };

  useEffect(() => {
    fetchTournamentData();
  }, [tournamentId]);

  if (loading) {
    return (
      <CenteredContainer>
        <Center h="300px">
          <VStack gap={4}>
            <Spinner size="xl" color="blue.400" />
            <Text color="gray.400" fontSize="lg">
              Loading tournament...
            </Text>
          </VStack>
        </Center>
      </CenteredContainer>
    );
  }

  if (!tournament) {
    return (
      <CenteredContainer>
        <Center h="300px">
          <Text color="gray.400" fontSize="lg">Tournament not found</Text>
        </Center>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <Button 
        onClick={() => navigate('/')} 
        mb={4}
        variant="outline"
        size="sm"
        colorScheme="blue"
      >
        ← Back to Tournaments
      </Button>
      
      <HStack justify="space-between" align="center" mb={4}>
        <Heading size="lg" color="white">{tournament.name}</Heading>
      </HStack>
      
      <Text mb={2} color="gray.300">Status: {tournament.status}</Text>
      <Text mb={2} color="gray.300">Start Date: {new Date(tournament.start_date).toLocaleDateString()}</Text>
      <Text mb={6} color="gray.300">Rounds: {tournament.rounds_count}</Text>
      
      <Tabs.Root defaultValue="schedule" w="100%">
        <Tabs.List bg="gray.800" borderRadius="lg" p={1}>
          <Tabs.Trigger 
            value="schedule" 
            color="gray.300"
            _selected={{ color: "blue.300", bg: "gray.700" }}
          >
            Schedule
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="leaderboard"
            color="gray.300" 
            _selected={{ color: "blue.300", bg: "gray.700" }}
          >
            Leaderboard
          </Tabs.Trigger>
          <Tabs.Trigger 
            value="registration"
            color="gray.300" 
            _selected={{ color: "blue.300", bg: "gray.700" }}
          >
            Registration
          </Tabs.Trigger>
        </Tabs.List>
        
        <Tabs.Content value="schedule" py={4}>
          <TournamentSchedule 
            tournament={tournament} 
            onScoreUpdate={handleScoreUpdate}
          />
        </Tabs.Content>
        
        <Tabs.Content value="leaderboard" py={4}>
          <LeaderboardTable players={leaderboard} />
        </Tabs.Content>
        
        <Tabs.Content value="registration" py={4}>
          <VStack gap={6} align="stretch">
            <PlayerRegistrationForm 
              tournamentId={tournament.id} 
              onPlayerRegistered={handlePlayerRegistered}
            />
            <RegisteredPlayersList 
              players={tournament.registered_players || []} 
              tournamentId={tournament.id}
              onPlayerRemoved={handlePlayerRemoved}
              canRemovePlayers={!tournament.rounds || tournament.rounds.length === 0}
            />
            <TournamentInitializer 
              tournament={tournament}
              onTournamentInitialized={handleTournamentInitialized}
            />
            <TournamentReset
              tournament={tournament}
              onTournamentReset={handleTournamentReset}
            />
            <TournamentDetailsCard tournament={tournament} />
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </CenteredContainer>
  );
}
