import { Box, Center, Heading, Text, Stack } from "@chakra-ui/react";

export default function DrinkCard({ name, abv, portions }) {
  return (
    <Center py={6} pl={4} pr={4}>
      <Box
        role={"group"}
        p={6}
        maxW={"800px"}
        w={"full"}
        bg={"white"}
        boxShadow={"2xl"}
        // rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      >
        <Stack align={"center"}>
          <Heading fontSize={"2xl"} fontFamily={"body"} fontWeight={600}>
            {name}
          </Heading>
          <Text color={"gray.500"} fontSize={"sm"} textTransform={"uppercase"}>
            {`${abv}% ABV`}
          </Text>
          <Stack direction={"row"} align={"center"}>
            <Text>{portions[0].name}</Text>
            <Text color={"gray.600"}>{`£${portions[0].price}`}</Text>
            <Text color={"red.400"} fontWeight={500}>
              {`${portions[0].unitsPerPound} u/£`}
            </Text>
          </Stack>
        </Stack>
      </Box>
    </Center>
  );
}
