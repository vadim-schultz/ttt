import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useState } from "react";
import {
  Tabs,
  Spinner,
  Heading,
  Text,
  Button,
  HStack,
  Center,
  VStack,
  Box,
} from "@chakra-ui/react";
import CenteredContainer from "@/components/ui/CenteredContainer";
import LeaderboardTable from "@/components/LeaderboardTable";
import type { CreatePlayer } from "@/types/types";
import PlayerRegistrationForm from "../components/PlayerRegistrationForm";
import RegisteredPlayersList from "../components/RegisteredPlayersList";
import TournamentDetailsCard from "../components/TournamentDetailsCard";
import TournamentInitializer from "../components/TournamentInitializer";
import TournamentReset from "../components/TournamentReset";
import TournamentSchedule from "../components/TournamentSchedule";
import { useTournament } from "../hooks/useTournament";

export default function TournamentContainer() {
  const { tournamentId } = useParams<{ tournamentId: string }>();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const {
    tournament,
    leaderboard,
    loading,
    error,
    leaderboardError,
    registrationStatus,
    initializerStatus,
    resetStatus,
    actions,
  } = useTournament(tournamentId);

  const handleScoreUpdate = useCallback(
    async (matchId: string, teamScores: number[], teamIds: string[]) => {
      await actions.submitScore({
        match_id: matchId,
        team_ids: teamIds,
        team_scores: teamScores,
      });
    },
    [actions]
  );

  const handlePlayerRegistration = useCallback(
    async (data: CreatePlayer) => {
      setIsRegistering(true);
      try {
        await actions.registerPlayer(data);
      } finally {
        setIsRegistering(false);
      }
    },
    [actions]
  );

  const handlePlayerRemoved = useCallback(
    async (playerId: string) => {
      await actions.removePlayer(playerId);
    },
    [actions]
  );

  const handleInitialize = useCallback(async () => {
    setIsInitializing(true);
    try {
      await actions.initialize();
    } finally {
      setIsInitializing(false);
    }
  }, [actions]);

  const handleReset = useCallback(async () => {
    setIsResetting(true);
    try {
      await actions.reset();
    } finally {
      setIsResetting(false);
    }
  }, [actions]);

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

  if (error) {
    return (
      <CenteredContainer>
        <Center h="300px">
          <VStack gap={3}>
            <Heading size="md" color="red.300">
              Unable to load tournament
            </Heading>
            <Text color="red.200" textAlign="center">
              {error}
            </Text>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={actions.refresh}
            >
              Retry
            </Button>
          </VStack>
        </Center>
      </CenteredContainer>
    );
  }

  if (!tournament) {
    return (
      <CenteredContainer>
        <Center h="300px">
          <Text color="gray.400" fontSize="lg">
            Tournament not found
          </Text>
        </Center>
      </CenteredContainer>
    );
  }

  return (
    <CenteredContainer>
      <Button
        onClick={() => navigate("/")}
        mb={4}
        variant="outline"
        size="sm"
        colorScheme="blue"
      >
        ← Back to Tournaments
      </Button>

      <HStack justify="space-between" align="center" mb={4}>
        <Heading size="lg" color="white">
          {tournament.name}
        </Heading>
      </HStack>

      <Text mb={2} color="gray.300">
        Status: {tournament.status}
      </Text>
      <Text mb={2} color="gray.300">
        Start Date: {new Date(tournament.start_date).toLocaleDateString()}
      </Text>
      <Text mb={6} color="gray.300">
        Rounds: {tournament.rounds_count}
      </Text>

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
          {leaderboardError && (
            <Box
              mb={4}
              p={3}
              borderWidth="1px"
              borderRadius="md"
              borderColor="red.300"
            >
              <Text color="red.300" fontSize="sm">
                {leaderboardError}
              </Text>
            </Box>
          )}
          <LeaderboardTable players={leaderboard} />
        </Tabs.Content>

        <Tabs.Content value="registration" py={4}>
          <VStack gap={6} align="stretch">
            <PlayerRegistrationForm
              onSubmit={handlePlayerRegistration}
              status={registrationStatus}
              clearStatus={actions.clearRegistrationStatus}
              isSubmitting={isRegistering}
            />
            <RegisteredPlayersList
              players={tournament.registered_players ?? []}
              canRemovePlayers={
                !tournament.rounds || tournament.rounds.length === 0
              }
              onRemovePlayer={handlePlayerRemoved}
            />
            <TournamentInitializer
              tournament={tournament}
              status={initializerStatus}
              clearStatus={actions.clearInitializerStatus}
              isLoading={isInitializing}
              onInitialize={handleInitialize}
            />
            <TournamentReset
              tournament={tournament}
              status={resetStatus}
              clearStatus={actions.clearResetStatus}
              isLoading={isResetting}
              onReset={handleReset}
            />
            <TournamentDetailsCard tournament={tournament} />
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </CenteredContainer>
  );
}
