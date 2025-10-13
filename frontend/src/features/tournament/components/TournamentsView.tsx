import { Box, Button, VStack } from "@chakra-ui/react";
import { CenteredContainer } from "@/shared/ui";
import type {
  CreateTournament,
  Tournament,
  StatusMessage,
} from "@/features/shared/types";
import TournamentsList from "./TournamentsList";
import TournamentCreationForm from "./TournamentCreationForm";

interface TournamentsViewProps {
  tournaments: Tournament[];
  onDeleteTournament: (tournamentId: string) => Promise<void>;
  showCreateForm: boolean;
  onToggleCreateForm: () => void;
  onCreateTournament: (payload: CreateTournament) => Promise<void>;
  creationStatus: StatusMessage | null;
  clearCreationStatus: () => void;
  isCreating: boolean;
}

export default function TournamentsView({
  tournaments,
  onDeleteTournament,
  showCreateForm,
  onToggleCreateForm,
  onCreateTournament,
  creationStatus,
  clearCreationStatus,
  isCreating,
}: TournamentsViewProps) {
  return (
    <CenteredContainer>
      <VStack gap={6} w="100%">
        <TournamentsList
          tournaments={tournaments}
          onDelete={onDeleteTournament}
        />

        <Box w="100%">
          <VStack gap={4}>
            <Button
              onClick={onToggleCreateForm}
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
                  onSubmit={onCreateTournament}
                  status={creationStatus}
                  clearStatus={clearCreationStatus}
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
