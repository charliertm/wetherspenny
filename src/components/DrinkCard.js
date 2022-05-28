import {
  Box,
  Center,
  Collapse,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import useLerpColorScroll from "../hooks/useLerpColorScroll";
import theme from "../styles/theme";

const PortionInfo = ({ name, price, unitsPerPound, color }) => {
  return (
    <Box w={"full"} pb={4} mx={2}>
      <HStack
        justify={"space-evenly"}
        w={"full"}
        bgColor={color}
        rounded={"md"}
        p={4}
      >
        <Text textColor={"white"} fontWeight={"bold"} fontSize={"l"}>
          {name}
        </Text>
        <Text
          textColor={"white"}
          fontWeight={"bold"}
          fontSize={"l"}
        >{`£${parseFloat(price).toFixed(2)}`}</Text>
        <Text textColor={"white"} fontWeight={"bold"} fontSize={"l"}>
          {`${parseFloat(unitsPerPound).toFixed(3)} u/£`}
        </Text>
      </HStack>
    </Box>
  );
};

export default function DrinkCard({ name, abv, portions, rank }) {
  const { isOpen, onToggle } = useDisclosure();
  const color = useLerpColorScroll(
    theme.colors.spoonyblue,
    theme.colors.dollargreen
  );
  const inverseColor = useLerpColorScroll(
    theme.colors.dollargreen,
    theme.colors.spoonyblue
  );

  return (
    <Box
      textAlign={"center"}
      bgColor={"white"}
      rounded={"md"}
      my={8}
      onClick={onToggle}
    >
      <HStack w="full" justify={"space-between"} py={8} px={2}>
        <Center rounded={"md"} bgColor={color} p={4}>
          <Text textColor={"white"} fontWeight={"bold"}>
            {`#${rank}`}
          </Text>
        </Center>

        <Text
          textColor={inverseColor}
          fontWeight={"black"}
          fontSize={["2xl", "3xl"]}
          px={2}
        >
          {name}
        </Text>
        <Center rounded={"md"} p={2}>
          <Text
            textColor={color}
            fontWeight={"semibold"}
            fontStyle={"italic"}
            fontSize={"xl"}
          >
            {`${abv}%`}
          </Text>
        </Center>
      </HStack>
      <Collapse in={isOpen} w={"full"}>
        {portions.map((portion, index) => {
          return (
            <HStack key={index}>
              <PortionInfo {...portion} key={index} color={inverseColor} />
            </HStack>
          );
        })}
      </Collapse>
    </Box>
  );
}
