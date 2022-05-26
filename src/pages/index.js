import { Flex } from "@chakra-ui/react";
import Head from "next/head";
import Logo from "../../public/static/Logo.svg";
import Footer from "../components/Footer";
import PubInput from "../components/PubInput";

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
      <Flex
        h={"100vh"}
        flexDirection={"column"}
        justify={"space-between"}
        alignSelf={"center"}
        alignItems={"center"}
        padding={20}
      >
        <Logo />
        <PubInput w={"full"} />
        <Footer />
      </Flex>
    </>
  );
}
