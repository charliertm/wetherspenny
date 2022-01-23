import { Center, VStack, Container, Box } from "@chakra-ui/react";
import PubInput from "../components/PubInput";
import Head from "next/head";
import TextLogo from "../../public/static/TextLogo.svg";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Head>
        <title>wetherspenny</title>
        <meta property="og:title" content="wetherspenny" key="title" />
        <link
          rel="apple-touch-icon"
          sizes="57x57"
          href="public/apple-touch-icon.png"
        />
      </Head>
      <Center h={"100vh"}>
        <VStack minW={"60vw"} spacing={20}>
          <Container minW={"40vw"}>
            <TextLogo />
          </Container>
          <Box />
          <PubInput
            p={6}
            maxW={"800px"}
            w={"full"}
            bg={"white"}
            boxShadow={"xl"}
            borderWidth={1}
            borderColor={"blackAlpha.400"}
            rounded={"md"}
            pos={"relative"}
            zIndex={1}
          />
          <Box />
          <Box>
            <Footer />
          </Box>
        </VStack>
      </Center>
    </>
  );
}
