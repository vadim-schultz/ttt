import { Alert, Box } from "@chakra-ui/react";

import { CenteredContainer } from "@/shared/ui";

interface AlertErrorProps {
  title: string;
  message?: string | null;
}

export default function AlertError({ title, message }: AlertErrorProps) {
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
          <Alert.Title>{title}</Alert.Title>
          {message && <Alert.Description>{message}</Alert.Description>}
        </Box>
      </Alert.Root>
    </CenteredContainer>
  );
}
