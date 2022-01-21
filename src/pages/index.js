import { Center } from "@chakra-ui/react";
import PubInput from "../components/PubInput";

export default function Home() {
  return (
    <Center h={"100vh"}>
      <PubInput
        m={4}
        p={6}
        maxW={"800px"}
        w={"full"}
        bg={"white"}
        boxShadow={"2xl"}
        // rounded={"lg"}
        pos={"relative"}
        zIndex={1}
      />
    </Center>
  );
}
