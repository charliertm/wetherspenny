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
  spoonyblue: "#0563C9",
  dollargreen: "#009245",
};

const theme = extendTheme({
  colors,
});

export default theme;
