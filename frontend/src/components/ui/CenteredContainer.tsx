import { Box } from "@chakra-ui/react";
import React from "react";

interface CenteredContainerProps {
  children: React.ReactNode;
  maxW?: string;
}

export default function CenteredContainer({ children, maxW = "1200px" }: CenteredContainerProps) {
  return (
    <Box 
      bg="gray.900" 
      minH="100vh" 
      display="flex" 
      flexDirection="column"
      alignItems="center" 
      justifyContent="flex-start" 
      px={6}
      py={8}
      width="100%"
    >
      <Box 
        width="100%" 
        maxW={maxW}
        margin="0 auto"
      >
        {children}
      </Box>
    </Box>
  );
}