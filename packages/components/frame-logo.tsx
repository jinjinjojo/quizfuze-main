import React from "react";

import { type ChakraProps, Image } from "@chakra-ui/react";

export const FrameLogo: React.FC<
  ChakraProps & { width?: string | number; height?: string | number }
> = ({
  width = "132px", // Default width
  height = "132px", // Default height
  ...props
}) => {
  return (
    <Image
      src="/apple-touch-icon.png"
      alt="Logo"
      width={width}
      height={height}
      objectFit="contain" // Maintain aspect ratio
      {...props}
    />
  );
};
