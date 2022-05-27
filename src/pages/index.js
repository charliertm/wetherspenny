import { Box, Container, Flex, Spinner } from "@chakra-ui/react";
import Head from "next/head";
import { useState } from "react";
import Logo from "../../public/static/Logo.svg";
import Footer from "../components/Footer";
import PubInput from "../components/PubInput";
import PubLocator from "../components/PubLocator";

export default function Home() {
  const [loading, setLoading] = useState(false);
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
      <Flex
        h={"100vh"}
        flexDirection={"column"}
        justify={"space-between"}
        alignSelf={"center"}
        alignItems={"center"}
        py={20}
      >
        <Box w={"full"} px={"5vw"}>
          <Logo />
        </Box>
        {loading ? (
          <Spinner size={"xl"} color="spoonyblue" thickness="4px" />
        ) : (
          <Container>
            <PubLocator handleLoading={() => setLoading(true)} />
            <PubInput w={"full"} handleLoading={() => setLoading(true)} />
          </Container>
        )}
        <Footer />
      </Flex>
    </>
  );
}
