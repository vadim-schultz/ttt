import { useState } from "react";
import { Box, Button, VStack, HStack, Text } from "@chakra-ui/react";
import type { Tournament } from "@/types/types";
import AdminPasswordPrompt from "@/components/AdminPasswordPrompt";
import type { StatusMessage } from "@/features/shared/types/status";

interface TournamentInitializerProps {
  tournament: Tournament;
  status: StatusMessage | null;
  clearStatus: () => void;
  isLoading: boolean;
  onInitialize: () => Promise<void>;
}

export default function TournamentInitializer({
  tournament,
  status,
  clearStatus,
  isLoading,
  onInitialize,
}: TournamentInitializerProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  const canInitialize = () =>
    (tournament.registered_players?.length ?? 0) >= 4 &&
    (tournament.rounds?.length ?? 0) === 0;

  const handleInitialize = async () => {
    try {
      await onInitialize();
      setShowConfirm(false);
      setShowPasswordPrompt(false);
    } finally {
      // leave status handling to parent via props
    }
  };

  // Already initialized
  if ((tournament.rounds?.length ?? 0) > 0) {
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
          <Text
            color="green.700"
            _dark={{ color: "green.200" }}
            fontWeight="medium"
          >
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
          <Text
            fontWeight="medium"
            color="blue.700"
            _dark={{ color: "blue.200" }}
          >
            ℹ️ Tournament cannot be initialized yet
          </Text>
          <Text fontSize="sm" color="blue.600" _dark={{ color: "blue.300" }}>
            Need at least 4 registered players. Currently have:{" "}
            {tournament.registered_players?.length ?? 0}
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
              <Text
                color="gray.800"
                _dark={{ color: "white" }}
                fontWeight="medium"
                textAlign="center"
              >
                Ready to Initialize Tournament
              </Text>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.300" }}
                textAlign="center"
              >
                This will create {tournament.rounds_count} rounds with matches
                for {tournament.registered_players?.length ?? 0} players
              </Text>
              <Button
                onClick={() => {
                  clearStatus();
                  setShowPasswordPrompt(true);
                }}
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
              <Text
                color="orange.700"
                _dark={{ color: "orange.200" }}
                fontWeight="medium"
                textAlign="center"
              >
                ⚠️ Confirm Initialization
              </Text>
              <Text
                fontSize="sm"
                color="gray.600"
                _dark={{ color: "gray.300" }}
                textAlign="center"
              >
                This action cannot be undone. The tournament will be initialized
                with:
              </Text>
              <VStack
                fontSize="sm"
                color="gray.700"
                _dark={{ color: "gray.200" }}
                gap={1}
              >
                <Text>• {tournament.rounds_count} rounds</Text>
                <Text>
                  •{" "}
                  {Math.max(
                    1,
                    Math.floor((tournament.registered_players?.length ?? 0) / 4)
                  )}{" "}
                  matches per round
                </Text>
                <Text>• All scores set to 0:0 initially</Text>
              </VStack>
              <HStack gap={2}>
                <Button
                  onClick={handleInitialize}
                  colorScheme="orange"
                  size="sm"
                  loading={isLoading}
                  disabled={isLoading}
                >
                  {isLoading ? "Initializing..." : "Yes, Initialize"}
                </Button>
                <Button
                  onClick={() => setShowConfirm(false)}
                  variant="outline"
                  size="sm"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </HStack>
            </>
          )}

          {status && (
            <Text color={status.type === "success" ? "green.500" : "red.500"}>
              {status.text}
            </Text>
          )}
        </VStack>
      </Box>

      {showPasswordPrompt && (
        <AdminPasswordPrompt
          title="Initialize Tournament"
          description={`This will create ${
            tournament.rounds_count
          } rounds with matches for ${
            tournament.registered_players?.length ?? 0
          } registered players. This action requires admin authorization.`}
          confirmButtonText="Initialize Tournament"
          confirmButtonColor="orange"
          onConfirm={() => {
            setShowConfirm(true);
            setShowPasswordPrompt(false);
          }}
          onCancel={() => {
            setShowPasswordPrompt(false);
            clearStatus();
          }}
          isLoading={false}
        />
      )}
    </>
  );
}
