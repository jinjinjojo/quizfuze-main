import { Open_Sans, Outfit } from "next/font/google";
import {
  type ChakraProps,
  type ChakraTheme,
  defineStyle,
  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";
import { type StyleFunctionProps, cssVar, mode } from "@chakra-ui/theme-tools";

export const outfit = Outfit({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
});

export const openSans = Open_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-open-sans",
});

export const config = { initialColorMode: "light", useSystemColorMode: false };

export const fonts = {
  heading: outfit.style.fontFamily,
  body: openSans.style.fontFamily,
};

export const colors = {
  orange: {
    50: "#fff7e6", // Lightest orange
    100: "#ffe5b4", // Lighter orange (softened)
    200: "#ffd399", // Adjusted to be less bright
    300: "#ffbc00", // Lighter orange
    400: "#d17100", // Your primary brand color
    500: "#c16500", // Darker orange
    600: "#a05200",
    700: "#7d3e00",
    800: "#592b00",
    900: "#3c1a00", // Darkest orange
  },
  gray: {
    50: "#f7f7f7", // Light gray
    100: "#eaeaea",
    200: "#d5d5d5",
    300: "#b0b0b0",
    400: "#8b8b8b",
    500: "#666666",
    600: "#444444",
    700: "#222222",
    800: "#1a1a1a",
    900: "#0d0d0d",
    750: "#242C3A",
    850: "#191D28",
    1000: "#171923",
  },
};

const $startColor = cssVar("skeleton-start-color");
const $endColor = cssVar("skeleton-end-color");

const card = defineStyle({
  [$startColor.variable]: "colors.white",
  [$endColor.variable]: "colors.white",
  _dark: {
    [$startColor.variable]: "colors.gray.700",
    [$endColor.variable]: "colors.gray.700",
  },
  opacity: 1,
});

const refined = defineStyle({
  [$startColor.variable]: "colors.gray.100",
  [$endColor.variable]: "colors.gray.400",
  _dark: {
    [$startColor.variable]: "colors.gray.750",
    [$endColor.variable]: "colors.gray.500",
  },
  opacity: 0.7,
});

const skeletonTheme = defineStyleConfig({
  variants: { card, refined },
});

export const components = {
  Button: {
    defaultProps: {
      colorScheme: "orange", // Change default color scheme to orange
    },
    variants: {
      outline: ({ colorMode, colorScheme }: StyleFunctionProps) => ({
        borderRadius: "lg",
        borderColor: colorScheme !== "red"
          ? colorMode == "light"
            ? "gray.300"
            : "gray.600"
          : undefined,
      }),
      ghost: () => ({
        borderRadius: "lg",
      }),
      solid: () => ({
        bg: "#d17100", // Primary brand color
        borderRadius: "lg",
        color: "white",
        shadow: "inset 0 1px 0 0 rgb(255 255 255/.2)",
        _hover: {
          bg: "orange.300", // Change hover to lighter orange
        },
      }),
    },
  },
  Popover: {
    baseStyle: ({ colorMode }: StyleFunctionProps) => ({
      popper: {
        width: "fit-content",
        maxWidth: "fit-content",
      },
      content: {
        background: colorMode == "light" ? "white" : "gray.750",
        borderColor: colorMode == "light" ? "gray.100" : "gray.700",
        shadow: "md",
      },
    }),
  },
  Input: {
    baseStyle: {
      field: {
        _placeholder: {
          color: "gray.500",
        },
        borderRadius: "lg",
      },
    },
    sizes: {
      md: {
        field: {
          px: "14px",
        },
      },
    },
  },
  FormLabel: {
    baseStyle: ({ colorMode }: StyleFunctionProps) => ({
      fontSize: "sm",
      color: colorMode == "light" ? "gray.600" : "gray.400",
    }),
  },
  Textarea: {
    baseStyle: {
      _placeholder: {
        color: "gray.500",
      },
    },
    sizes: {
      md: {
        px: "14px",
      },
    },
  },
  Menu: {
    baseStyle: {
      list: {
        shadow: "lg",
        borderRadius: "lg",
      },
    },
  },
  Tooltip: {
    baseStyle: ({ colorMode }: StyleFunctionProps) => ({
      borderRadius: "md",
      bg: colorMode == "light" ? "white" : "gray.750",
      textColor: colorMode == "light" ? "black" : "white",
    }),
  },
  Container: {
    baseStyle: {
      px: { base: 4, sm: 8 },
    },
  },
  Link: {
    baseStyle: {
      _hover: { textDecoration: "none" },
    },
  },
  Switch: {
    baseStyle: ({ colorMode }: StyleFunctionProps) => ({
      track: {
        borderWidth: "2px",
        borderColor: colorMode == "light" ? "gray.100" : "gray.700",
        bg: colorMode == "light" ? "gray.200" : "gray.750",
        _checked: {
          bg: "orange.300", // Change checked color to lighter orange
        },
      },
    }),
  },
  Skeleton: skeletonTheme,
  Checkbox: {
    baseStyle: () => ({
      control: {
        rounded: "md",
        _checked: { background: "#d17100", borderColor: "#d17100" },
      },
      icon: { color: "white", padding: "2px" },
    }),
  },
  Avatar: {
    baseStyle: ({ colorMode }: StyleFunctionProps) => ({
      excessLabel: {
        bg: colorMode == "light" ? "gray.200" : "gray.700",
        fontWeight: 600,
      },
    }),
  },
};

export const styles = {
  global: (props: ChakraProps) => ({
    body: {
      bg: mode("gray.50", "gray.1000")(props),
    },
  }),
};

export const breakpoints = {
  base: "0em", // 0px
  sm: "30em", // ~480px
  sd: "40em", // ~640px
  md: "48em", // ~768px
  lg: "62em", // ~992px
  xl: "80em", // ~1280px
  "2xl": "96em", // ~1536px
};

export const theme = extendTheme({
  fonts,
  components,
  colors,
  config,
  styles,
  breakpoints,
}) as ChakraTheme;
