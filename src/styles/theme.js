import { extendTheme } from "@chakra-ui/react";

// const styles = {
//   global: () => ({
//     body: {
//       color: "gray.600",
//       bg: "white",
//     },
//   }),
// };

const colors = {
  wetherspoons: {
    500: "#0261c8",
  },
};

const semanticTokens = {
  colors: {
    spoonyblue: "#0563C9",
    dollargreen: "#009245",
  },
};

const theme = extendTheme({
  colors,
  semanticTokens,
});

export default theme;
