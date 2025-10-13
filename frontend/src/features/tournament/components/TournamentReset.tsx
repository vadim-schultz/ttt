import { useState } from "react";
import { Box, Button, VStack, HStack, Text, Heading } from "@chakra-ui/react";
import type { Tournament, StatusMessage } from "@/features/shared/types";
import AdminPasswordPrompt from "@/shared/admin-password";

interface TournamentResetProps {
  tournament: Tournament;
  status: StatusMessage | null;
  clearStatus: () => void;
  isLoading: boolean;
  onReset: () => Promise<void>;
}

export default function TournamentReset({
  tournament,
  status,
  clearStatus,
  isLoading,
  onReset,
}: TournamentResetProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const canReset = () => (tournament.rounds?.length ?? 0) > 0;

  const handleReset = async () => {
    await onReset();
    setShowConfirm(false);
    setShowPasswordPrompt(false);
  };

  if (!canReset()) {
    return null;
  }

  return (
    <>
      <Box
        p={6}
        bg="red.900"
        borderRadius="lg"
        border="1px solid"
        borderColor="red.600"
      >
        <VStack gap={4} align="stretch">
          <Box>
            <Heading size="md" color="red.100" mb={2}>
              Reset Tournament
            </Heading>
            <Text color="red.200" fontSize="sm">
              This will remove all rounds, matches, and scores while keeping the
              tournament and registered players intact. The tournament can be
              re-initialized afterwards.
            </Text>
          </Box>

          {status && (
            <Box
              p={3}
              borderRadius="md"
              bg={status.type === "success" ? "green.700" : "red.700"}
              borderColor={status.type === "success" ? "green.500" : "red.500"}
              borderWidth="1px"
            >
              <Text
                color={status.type === "success" ? "green.100" : "red.100"}
                fontSize="sm"
              >
                {status.text}
              </Text>
            </Box>
          )}

          {!showConfirm ? (
            <Button
              colorScheme="red"
              variant="outline"
              size="sm"
              onClick={() => {
                clearStatus();
                setShowPasswordPrompt(true);
              }}
              disabled={isLoading}
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
                  This action will permanently delete all rounds, matches, and
                  scores. Only the tournament details and registered players
                  will be preserved.
                </Text>
              </Box>

              <HStack justify="space-between">
                <Button
                  size="sm"
                  variant="outline"
                  colorScheme="gray"
                  onClick={() => setShowConfirm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  colorScheme="red"
                  onClick={handleReset}
                  loading={isLoading}
                >
                  {isLoading ? "Resetting..." : "Yes, Reset Tournament"}
                </Button>
              </HStack>
            </VStack>
          )}

          <Box>
            <Text color="red.300" fontSize="xs">
              Current state: {tournament.rounds?.length ?? 0} rounds,
              {tournament.rounds?.reduce(
                (total, round) => total + (round.matches?.length ?? 0),
                0
              ) ?? 0}{" "}
              matches
            </Text>
          </Box>
        </VStack>
      </Box>

      {showPasswordPrompt && (
        <AdminPasswordPrompt
          title="Reset Tournament"
          description={`This will permanently delete all ${
            tournament.rounds?.length ?? 0
          } rounds and ${
            tournament.rounds?.reduce(
              (total, round) => total + (round.matches?.length ?? 0),
              0
            ) ?? 0
          } matches while preserving tournament details and registered players. This action requires admin authorization.`}
          confirmButtonText="Reset Tournament"
          confirmButtonColor="red"
          onConfirm={() => {
            setShowConfirm(true);
            setShowPasswordPrompt(false);
          }}
          onCancel={() => setShowPasswordPrompt(false)}
          isLoading={false}
        />
      )}
    </>
  );
}
