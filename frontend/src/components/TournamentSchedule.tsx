import { Box, VStack, Heading, Text, Grid } from "@chakra-ui/react";
import type { Tournament, Round, Match } from "@/types/types";
import MatchCard from "@/components/MatchCard";

interface TournamentScheduleProps {
  tournament: Tournament;
  onScoreUpdate?: (matchId: string, teamScores: number[], teamIds: string[]) => Promise<void>;
}

export default function TournamentSchedule({ tournament, onScoreUpdate }: TournamentScheduleProps) {
  return (
    <VStack align="stretch" gap={8}>
      {tournament.rounds.map((round: Round) => (
        <Box 
          key={round.id} 
          bg="gray.900"
          p={6} 
          borderWidth="1px" 
          borderColor="gray.700"
          borderRadius="xl"
          _hover={{ borderColor: "gray.600" }}
          transition="border-color 0.2s"
        >
          <Heading 
            size="md" 
            mb={6}
            color="blue.300"
            borderBottom="2px solid"
            borderColor="blue.800"
            pb={2}
          >
            Round {round.round_number}
          </Heading>
          
          {round.matches.length > 0 ? (
            <Grid
              templateColumns={{
                base: "1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)"
              }}
              gap={4}
            >
              {round.matches.map((match: Match) => (
                <MatchCard 
                  key={match.id} 
                  match={match} 
                  onScoreUpdate={onScoreUpdate}
                />
              ))}
            </Grid>
          ) : (
            <Text color="gray.500" textAlign="center" py={8}>
              No matches scheduled in this round
            </Text>
          )}
        </Box>
      ))}
      
      {tournament.rounds.length === 0 && (
        <Box 
          textAlign="center" 
          py={12}
          bg="gray.900"
          borderRadius="xl"
          borderWidth="1px"
          borderColor="gray.700"
        >
          <Text color="gray.500" fontSize="lg">
            No rounds scheduled yet
          </Text>
          <Text color="gray.600" fontSize="sm" mt={2}>
            Tournament schedule will appear here once rounds are created
          </Text>
        </Box>
      )}
    </VStack>
  );
}