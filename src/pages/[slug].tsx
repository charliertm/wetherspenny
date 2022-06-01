import { Box, Flex, Input, List } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import ErrorPage from "next/error";
import fetch from "node-fetch";
import { ChangeEvent, useEffect, useState } from "react";
import LogoWhite from "../../public/static/LogoWhite.svg";
import type { PortionInfoProps } from "../components/DrinkCard";
import DrinkCard from "../components/DrinkCard";
import { slugsToIds } from "../data/slugsToIds";
import useLerpColorScroll from "../hooks/useLerpColorScroll";
import theme from "../styles/theme";

type DrinkData = {
  name: string;
  abv: number;
  portions: PortionInfoProps[];
};

interface RankedDrinkData extends DrinkData {
  rank: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const params = context.params!;
    const slug = params.slug as string;
    const id = slugsToIds[slug];
    const res = await fetch(`https://wetherspenny-api.herokuapp.com/${id}`);
    const dataRecieved = (await res.json()) as DrinkData[];
    const data: RankedDrinkData[] = dataRecieved.map((drink, index) => ({
      ...drink,
      rank: index + 1,
    }));
    return {
      props: { data },
    };
  } catch {
    context.res.statusCode = 404;
    return {
      props: {},
    };
  }
};

export default function Slug({ data }: { data: RankedDrinkData[] }) {
  const [drinks, setDrinks] = useState<RankedDrinkData[]>([]);
  const color = useLerpColorScroll(
    theme.colors.dollargreen,
    theme.colors.spoonyblue
  );

  useEffect(() => {
    setDrinks(data);
  }, [data]);

  if (!data) {
    return <ErrorPage statusCode={404} />;
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDrinks(
      data.filter((drink) => {
        return drink.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase());
      })
    );
  };
  return (
    <Box bgColor={color} minH="100vh" align={"center"}>
      <Flex flexDir={"column"} p={2} pt={8} maxW={"container.md"}>
        <LogoWhite />
        <Input
          mt={6}
          color="white"
          placeholder={"Search for your favourites"}
          _placeholder={{
            opacity: 0.6,
            color: "inherit",
          }}
          borderWidth={3}
          borderColor="white"
          textAlign="center"
          fontWeight="semibold"
          focusBorderColor="spoonyblue"
          _hover={{
            borderColor: "spoonyblue",
          }}
          onChange={(e) => handleChange(e)}
        />
        <List w={"full"}>
          {drinks.map((drink, index) => {
            return (
              <DrinkCard
                key={index}
                name={drink.name}
                abv={drink.abv.toString()}
                rank={drink.rank}
                portions={drink.portions}
              ></DrinkCard>
            );
          })}
        </List>
      </Flex>
    </Box>
  );
}
