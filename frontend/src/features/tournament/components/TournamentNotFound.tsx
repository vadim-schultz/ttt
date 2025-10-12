import { Center, Text } from "@chakra-ui/react";
import CenteredContainer from "@/components/ui/CenteredContainer";

export default function TournamentNotFound() {
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
