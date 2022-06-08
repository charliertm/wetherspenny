import {
  Box,
  Center,
  Collapse,
  Flex,
  HStack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import useLerpColorScroll from "../hooks/useLerpColorScroll";
import { RankedProductData } from "../pages/[slug]";
import theme from "../styles/theme";
import { PortionData } from "../utils/api/ProductData";

interface PortionInfoProps extends PortionData {
  color: string;
}

const PortionInfo = ({
  name,
  price,
  unitsPerPound,
  color,
}: PortionInfoProps) => {
  return (
    <Box w={"full"} pb={2} mx={2}>
      <Flex
        direction={"row"}
        h={20}
        bgColor={color}
        align={"center"}
        rounded={"md"}
      >
        <Text flex={1} color="white" fontSize={"lg"} fontWeight={"semibold"}>
          {name}
        </Text>
        <Text flex={1} color="white" fontSize={"lg"} fontWeight={"semibold"}>
          {`£${price.toFixed(2)}`}
        </Text>
        <Text flex={1} color="white" fontSize={"lg"} fontWeight={"semibold"}>
          {(unitsPerPound * 100).toFixed(1)}
        </Text>
      </Flex>
    </Box>
  );
};

export default function DrinkCard({
  name,
  abv,
  portions,
  rank,
}: RankedProductData) {
  const { isOpen, onToggle } = useDisclosure();
  const inverseColor = useLerpColorScroll(
    theme.colors.spoonyblue,
    theme.colors.dollargreen
  );
  const color = useLerpColorScroll(
    theme.colors.dollargreen,
    theme.colors.spoonyblue
  );

  return (
    <Box
      textAlign={"center"}
      bgColor={"white"}
      rounded={"md"}
      my={4}
      boxShadow={"md"}
      onClick={onToggle}
    >
      <Flex
        direction={"row"}
        justify={"space-between"}
        minH={32}
        align={"center"}
      >
        <Flex direction={"column"} ml={2} mr={4} my={4} alignSelf={"center"}>
          <Text
            textAlign="start"
            color={inverseColor}
            fontWeight="bold"
            fontSize={"2xl"}
            noOfLines={isOpen ? undefined : 2}
          >
            {name}{" "}
          </Text>
          <Text
            textAlign="start"
            color={color}
            fontSize="md"
            fontWeight="semibold"
            fontStyle={"italic"}
          >
            {`${abv}%`}
          </Text>
        </Flex>

        <Flex
          direction={"row"}
          textColor="white"
          fontWeight={"semibold"}
          fontSize="xl"
        >
          <Center
            bgColor={inverseColor}
            px={2}
            mr={2}
            my={4}
            minW={16}
            h={16}
            rounded={"md"}
          >
            <Text>{`#${rank}`}</Text>
          </Center>
          <Center
            bgColor={color}
            px={2}
            mr={2}
            my={4}
            minW={16}
            h={16}
            rounded={"md"}
          >
            <Text>{(portions[0].unitsPerPound * 100).toFixed(1)}</Text>
          </Center>
        </Flex>
      </Flex>
      <Collapse in={isOpen}>
        <Flex
          direction={"row"}
          fontWeight={"semibold"}
          pb={2}
          mx={2}
          textColor={inverseColor}
        >
          <Text flex={1}>Portion</Text>
          <Text flex={1}>Price</Text>
          <Text flex={1}>Score</Text>
        </Flex>
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
