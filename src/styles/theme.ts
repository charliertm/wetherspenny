import { extendTheme } from "@chakra-ui/react";

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
