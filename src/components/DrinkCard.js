import {
  Box,
  Center,
  Heading,
  Text,
  Stack,
  Icon,
  Collapse,
  Fade,
  useDisclosure,
  VStack,
  HStack,
  Spacer,
  StackDivider,
  Tooltip,
  VisuallyHidden,
} from "@chakra-ui/react";
import { FaTrophy, FaStar, FaDollarSign } from "react-icons/fa";
import { useState } from "react";

const ranks = {
  1: "gold",
  2: "silver",
  3: "orange.700",
};

const PortionInfo = ({ name, price, unitsPerPound, ...props }) => {
  return (
    <HStack justify={"space-between"} w={"full"} {...props}>
      <Text fontWeight={500}>{name}</Text>
      <Text color={"gray.600"} fontWeight={500}>{`£${parseFloat(price).toFixed(
        2
      )}`}</Text>
      <Text color={"red.500"} fontWeight={500}>
        {`${parseFloat(unitsPerPound).toFixed(3)} u/£`}
      </Text>
    </HStack>
  );
};

export default function DrinkCard({ name, abv, portions, rank }) {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Center py={6} pl={4} pr={4}>
      <Box
        p={6}
        maxW={"800px"}
        w={"full"}
        bg={"white"}
        boxShadow={"xl"}
        rounded={"lg"}
        borderWidth={1}
        borderColor={"blackAlpha.200"}
        onClick={onToggle}
      >
        <VStack align={"center"}>
          {rank in ranks ? (
            <Icon
              as={FaTrophy}
              color={ranks[rank]}
              alignSelf={"start"}
              boxSize={6}
            />
          ) : (
            <Heading alignSelf={"start"} fontSize={24} pl={2} color={"red.200"}>
              {rank}
            </Heading>
          )}
          <Heading
            textAlign={"center"}
            fontSize={"2xl"}
            fontFamily={"body"}
            fontWeight={600}
          >
            {name}
          </Heading>
          <Text color={"gray.500"} fontSize={"sm"} textTransform={"uppercase"}>
            {`${abv}% ABV`}
          </Text>
          <Collapse
            in={portions.length > 1 ? isOpen : true}
            w={"full"}
            startingHeight={30}
          >
            {portions.map((portion, index) => {
              return (
                <HStack key={index}>
                  {index === 0 ? (
                    <Tooltip label={"Best Value"}>
                      <Icon as={FaDollarSign} boxSize={4} color={"green.200"} />
                    </Tooltip>
                  ) : (
                    <Box boxSize={4} />
                  )}
                  <PortionInfo {...portion} h={22} py={4} key={index} />
                </HStack>
              );
            })}
          </Collapse>
        </VStack>
      </Box>
    </Center>
  );
}
