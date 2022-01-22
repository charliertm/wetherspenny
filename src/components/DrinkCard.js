import { Box, Center, Heading, Text, Stack, Icon } from "@chakra-ui/react";
import { FaTrophy } from "react-icons/fa";
import { useState } from "react";

const ranks = {
  1: "gold",
  2: "silver",
  3: "orange.700",
};

export default function DrinkCard({ name, abv, portions, rank }) {
  const [show, setShow] = useState(false);

  const handleToggle = () => {
    setShow(!show);
  };
  return (
    <Center py={6} pl={4} pr={4}>
      <Box
        p={6}
        maxW={"800px"}
        w={"full"}
        bg={"white"}
        boxShadow={"lg"}
        rounded={"lg"}
        borderWidth={2}
        borderColor={"black"}
        onClick={handleToggle}
      >
        <Stack align={"center"}>
          {rank in ranks ? (
            <Icon
              as={FaTrophy}
              color={ranks[rank]}
              alignSelf={"start"}
              boxSize={6}
            />
          ) : (
            <Heading alignSelf={"start"} fontSize={24} pl={2}>
              {rank}
            </Heading>
          )}
          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={600}>
            {name}
          </Heading>
          <Text color={"gray.500"} fontSize={"sm"} textTransform={"uppercase"}>
            {`${abv}% ABV`}
          </Text>
          <Stack direction={"row"} align={"center"}>
            <Text fontWeight={500}>{portions[0].name}</Text>
            <Text color={"gray.600"} fontWeight={500}>{`£${parseFloat(
              portions[0].price
            ).toFixed(2)}`}</Text>
            <Text color={"red.400"} fontWeight={500}>
              {`${portions[0].unitsPerPound} u/£`}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
