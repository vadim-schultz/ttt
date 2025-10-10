import { useState } from "react";
import { Spinner, Center, VStack, Text, Button, Box } from "@chakra-ui/react";
import CenteredContainer from "@/components/ui/CenteredContainer";
import TournamentCreationForm from "../components/TournamentCreationForm";
import TournamentsList from "../components/TournamentsList";
import { useTournaments } from "../hooks/useTournaments";

export default function TournamentsContainer() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { tournaments, loading, error, creationStatus, isCreating, actions } =
    useTournaments();

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
          <Box
            w="100%"
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            borderColor="red.300"
          >
            <VStack gap={2}>
              <Text color="red.500" fontWeight="semibold">
                Couldn't load tournaments
              </Text>
              <Text color="red.400" fontSize="sm" textAlign="center">
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
          </Box>
        ) : (
          <TournamentsList
            tournaments={tournaments}
            onDelete={actions.delete}
          />
        )}

        <Box w="100%">
          <VStack gap={4}>
            <Button
              onClick={() => {
                if (creationStatus) {
                  actions.clearCreationStatus();
                }
                setShowCreateForm((value: boolean) => !value);
              }}
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
                <TournamentCreationForm
                  onSubmit={actions.create}
                  status={creationStatus}
                  clearStatus={actions.clearCreationStatus}
                  isSubmitting={isCreating}
                />
              </Box>
            )}
          </VStack>
        </Box>
      </VStack>
    </CenteredContainer>
  );
}
