import { Center, Image, VStack, Container, Box } from "@chakra-ui/react";
import PubInput from "../components/PubInput";
import Head from "next/head";
import TextLogo from "../../public/static/TextLogo.svg";

export default function Home() {
  return (
    <>
      <Head>
        <title>wetherspenny</title>
        <meta property="og:title" content="wetherspenny" key="title" />
      </Head>
      <Center h={"100vh"}>
        <VStack minW={"60vw"} spacing={20}>
          <Container minW={"40vw"}>
            <TextLogo />
          </Container>
          <Box />
          <PubInput
            // m={4}
            p={6}
            maxW={"800px"}
            w={"full"}
            bg={"white"}
            boxShadow={"lg"}
            borderWidth={"2px"}
            borderColor={"gray.600"}
            rounded={"md"}
            pos={"relative"}
            zIndex={1}
          />
          <Box />
          <Box>Footer</Box>
        </VStack>
      </Center>
    </>
  );
}
