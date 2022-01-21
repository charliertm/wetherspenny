import { Center } from "@chakra-ui/react";
import PubInput from "../components/PubInput";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Wetherspenny</title>
        <meta property="og:title" content="Wetherspenny" key="title" />
      </Head>
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
    </>
  );
}
