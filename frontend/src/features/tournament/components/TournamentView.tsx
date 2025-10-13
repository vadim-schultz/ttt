import {
  Tabs,
  Button,
  HStack,
  Heading,
  Text,
  VStack,
  Box,
} from "@chakra-ui/react";
import { CenteredContainer } from "@/shared/ui";
import LeaderboardTable from "@/features/leaderboard/components/LeaderboardTable";
import type {
  CreatePlayer,
  Player,
  Tournament,
  StatusMessage,
} from "@/features/shared/types";
import PlayerRegistrationForm from "../components/PlayerRegistrationForm";
import RegisteredPlayersList from "../components/RegisteredPlayersList";
import TournamentDetailsCard from "../components/TournamentDetailsCard";
import TournamentInitializer from "../components/TournamentInitializer";
import TournamentReset from "../components/TournamentReset";
import TournamentSchedule from "../components/TournamentSchedule";

interface TournamentViewProps {
  tournament: Tournament;
  leaderboard: Player[];
  leaderboardError: string | null;
  onBack: () => void;
  onScoreUpdate: (
    matchId: string,
    teamScores: number[],
    teamIds: string[]
  ) => Promise<void>;
  onPlayerRegistration: (data: CreatePlayer) => Promise<void>;
  onPlayerRemoved: (playerId: string) => Promise<void>;
  onInitialize: () => Promise<void>;
  onReset: () => Promise<void>;
  registrationStatus: StatusMessage | null;
  initializerStatus: StatusMessage | null;
  resetStatus: StatusMessage | null;
  clearRegistrationStatus: () => void;
  clearInitializerStatus: () => void;
  clearResetStatus: () => void;
  isRegistering: boolean;
  isInitializing: boolean;
  isResetting: boolean;
}

export default function TournamentView({
  tournament,
  leaderboard,
  leaderboardError,
  onBack,
  onScoreUpdate,
  onPlayerRegistration,
  onPlayerRemoved,
  onInitialize,
  onReset,
  registrationStatus,
  initializerStatus,
  resetStatus,
  clearRegistrationStatus,
  clearInitializerStatus,
  clearResetStatus,
  isRegistering,
  isInitializing,
  isResetting,
}: TournamentViewProps) {
  return (
    <CenteredContainer>
      <Button
        onClick={onBack}
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
            onScoreUpdate={onScoreUpdate}
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
              onSubmit={onPlayerRegistration}
              status={registrationStatus}
              clearStatus={clearRegistrationStatus}
              isSubmitting={isRegistering}
            />
            <RegisteredPlayersList
              players={tournament.registered_players ?? []}
              canRemovePlayers={
                !tournament.rounds || tournament.rounds.length === 0
              }
              onRemovePlayer={onPlayerRemoved}
            />
            <TournamentInitializer
              tournament={tournament}
              status={initializerStatus}
              clearStatus={clearInitializerStatus}
              isLoading={isInitializing}
              onInitialize={onInitialize}
            />
            <TournamentReset
              tournament={tournament}
              status={resetStatus}
              clearStatus={clearResetStatus}
              isLoading={isResetting}
              onReset={onReset}
            />
            <TournamentDetailsCard tournament={tournament} />
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </CenteredContainer>
  );
}
