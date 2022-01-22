import { Flex, HStack, Icon, Link, Spacer, Text } from "@chakra-ui/react";
import { FaApple, FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <Flex>
      <HStack as={Link} href={"/add-me-as-an-app"}>
        <Icon as={FaApple} />
        <Text>Add Me as an App</Text>
      </HStack>
      <Spacer pl={2} pr={2}>
        |
      </Spacer>
      <HStack as={Link} href={"https://github.com/charliertm/wetherspenny"}>
        <Icon as={FaGithub} />
        <Text>Source Code</Text>
      </HStack>
    </Flex>
  );
}
