import { extendTheme } from "@chakra-ui/react";

const styles = {
  global: (props) => ({
    body: {
      color: "gray.600",
      bg: "wetherspoons.500",
    },
  }),
};

const components = {
  // for customing default chakra components
};

const colors = {
  wetherspoons: {
    500: "#0261c8",
  },
};

const theme = extendTheme({
  components,
  styles,
  colors,
});

export default theme;
