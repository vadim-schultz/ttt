import { Box, Heading, VStack, Text, HStack, Badge } from "@chakra-ui/react";
import type { Tournament } from "@/types/types";

interface TournamentDetailsCardProps {
  tournament: Tournament;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "ongoing":
      return "green";
    case "completed":
      return "blue";
    default:
      return "gray";
  }
};

export default function TournamentDetailsCard({
  tournament,
}: TournamentDetailsCardProps) {
  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      p={6}
      borderColor="gray.200"
      _dark={{ borderColor: "gray.600", bg: "gray.800" }}
      bg="white"
    >
      <Heading size="md" mb={4} color="gray.800" _dark={{ color: "white" }}>
        Tournament Details
      </Heading>

      <VStack align="stretch" gap={3}>
        <HStack justify="space-between" align="center">
          <Text
            fontWeight="semibold"
            color="gray.700"
            _dark={{ color: "gray.200" }}
          >
            Name:
          </Text>
          <Text color="gray.800" _dark={{ color: "white" }} textAlign="right">
            {tournament.name}
          </Text>
        </HStack>

        <HStack justify="space-between" align="center">
          <Text
            fontWeight="semibold"
            color="gray.700"
            _dark={{ color: "gray.200" }}
          >
            Start Date:
          </Text>
          <Text color="gray.800" _dark={{ color: "white" }}>
            {formatDate(tournament.start_date)}
          </Text>
        </HStack>

        <HStack justify="space-between" align="center">
          <Text
            fontWeight="semibold"
            color="gray.700"
            _dark={{ color: "gray.200" }}
          >
            Status:
          </Text>
          <Badge
            colorScheme={getStatusColor(tournament.status)}
            variant="solid"
          >
            {tournament.status}
          </Badge>
        </HStack>

        <HStack justify="space-between" align="center">
          <Text
            fontWeight="semibold"
            color="gray.700"
            _dark={{ color: "gray.200" }}
          >
            Rounds:
          </Text>
          <Text color="gray.800" _dark={{ color: "white" }}>
            {tournament.rounds_count}
          </Text>
        </HStack>

        <HStack justify="space-between" align="center">
          <Text
            fontWeight="semibold"
            color="gray.700"
            _dark={{ color: "gray.200" }}
          >
            Registered Players:
          </Text>
          <Text
            color="blue.600"
            _dark={{ color: "blue.400" }}
            fontWeight="medium"
          >
            {tournament.registered_players?.length ?? 0}
          </Text>
        </HStack>

        <HStack justify="space-between" align="center">
          <Text
            fontWeight="semibold"
            color="gray.700"
            _dark={{ color: "gray.200" }}
          >
            Scheduled Rounds:
          </Text>
          <Text color="gray.800" _dark={{ color: "white" }}>
            {tournament.rounds?.length ?? 0}
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
}
