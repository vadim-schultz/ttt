import { Alert, Box } from "@chakra-ui/react";
import { CenteredContainer } from "@/shared/ui";

interface Props {
  message: string | null;
}

export default function LeaderboardError({ message }: Props) {
  return (
    <CenteredContainer>
      <Alert.Root
        status="error"
        bg="red.900"
        borderColor="red.600"
        color="red.100"
      >
        <Alert.Indicator />
        <Box>
          <Alert.Title>Error Loading Leaderboard</Alert.Title>
          <Alert.Description>{message}</Alert.Description>
        </Box>
      </Alert.Root>
    </CenteredContainer>
  );
}
