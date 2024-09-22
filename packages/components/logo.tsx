
import React from "react";
import { chakra, ImageProps } from "@chakra-ui/react";

interface LogoProps extends ImageProps {
  width?: number | string;
  height?: number | string;
}

export const Logo: React.FC<LogoProps> = ({ width, height, ...props }) => {
  return (
    <chakra.img
      src="/apple-touch-icon.png"
      alt="Logo"
      width={width}
      height={height}
      {...props}
    />
  );
};
