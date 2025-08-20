import {
  Accordion,
  Stack,
  Text,
  Box,
  VStack,
  Span,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import type { Tournament } from "@/types/types";

interface TournamentsListProps {
  tournaments: Tournament[];
}

export default function TournamentsList({ tournaments }: TournamentsListProps) {
  return (
    <VStack align="center" w="100%" py="6">
      <Accordion.Root w="80%" maxW="2xl" collapsible>
        {tournaments.map((tournament) => (
          <Accordion.Item key={tournament.id} value={tournament.id}>
            <Accordion.ItemTrigger>
              <Span flex="1">
                <ChakraLink
                  as={Link}
                  href={`/tournament/${tournament.id}`}
                  fontWeight="bold"
                  color="teal.600"
                >
                  {tournament.id}
                </ChakraLink>
              </Span>
              <Accordion.ItemIndicator />
            </Accordion.ItemTrigger>
            <Accordion.ItemContent>
              <Accordion.ItemBody>
                <Stack gap="4">
                  {tournament.rounds?.map((round) => (
                    <Accordion.Root
                      key={round.id}
                      collapsible
                      size="sm"
                      variant="subtle"
                    >
                      <Accordion.Item value={round.id}>
                        <Accordion.ItemTrigger>
                          <Span flex="1" fontWeight="semibold">
                            Round {round.round_number}
                          </Span>
                          <Accordion.ItemIndicator />
                        </Accordion.ItemTrigger>
                        <Accordion.ItemContent>
                          <Accordion.ItemBody>
                            <Stack gap="2">
                              {round.matches?.map((match) => (
                                <Box
                                  key={match.id}
                                  p="3"
                                  rounded="md"
                                  borderWidth="1px"
                                  borderColor="gray.200"
                                  shadow="sm"
                                >
                                  <Text>
                                    {match.teams[0].players[0].name} +{" "}
                                    {match.teams[0].players[1].name} vs{" "}
                                    {match.teams[1].players[0].name} +{" "}
                                    {match.teams[1].players[1].name}
                                  </Text>
                                  <Text fontSize="sm" color="gray.500">
                                    Score: {match.teams[0].score} -{" "}
                                    {match.teams[1].score}
                                  </Text>
                                </Box>
                              ))}
                            </Stack>
                          </Accordion.ItemBody>
                        </Accordion.ItemContent>
                      </Accordion.Item>
                    </Accordion.Root>
                  ))}
                </Stack>
              </Accordion.ItemBody>
            </Accordion.ItemContent>
          </Accordion.Item>
        ))}
      </Accordion.Root>
    </VStack>
  );
}
