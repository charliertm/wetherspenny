import Head from "next/head";

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>wetherspenny</title>
        <meta property="og:title" content="wetherspenny" key="title" />
      </Head>
      {children}
    </>
  );
}
