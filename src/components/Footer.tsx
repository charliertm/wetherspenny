import { Flex, HStack, Icon, Link, Text } from "@chakra-ui/react";
import { FaApple, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <Flex flexDir={"row"}>
      <HStack as={Link} href={"/add-me-as-an-app"} px={2}>
        <Icon as={FaApple} color={"spoonyblue"} />
        <Text textColor={"spoonyblue"} fontWeight={"bold"}>
          Add Me as an App
        </Text>
      </HStack>
      <HStack as={Link} href={"https://github.com/charliertm/wetherspenny"}>
        <Icon as={FaGithub} color={"dollargreen"} />
        <Text textColor={"dollargreen"} fontWeight={"bold"}>
          Source Code
        </Text>
      </HStack>
    </Flex>
  );
}
