import { Box, Flex, Input, List, SlideFade } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import ErrorPage from "next/error";
import { ChangeEvent, useEffect, useState } from "react";
import LogoWhite from "../../public/static/LogoWhite.svg";
import DrinkCard from "../components/DrinkCard";
import { slugsToIds } from "../data/slugsToIds";
import useLerpColorScroll from "../hooks/useLerpColorScroll";
import theme from "../styles/theme";
import { getProductsDataFromPubId } from "../utils/api";
import { ProductData } from "../utils/api/ProductData";

export interface RankedProductData extends ProductData {
  rank: number;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const params = context.params!;
    const slug = params.slug as string;
    const id = slugsToIds[slug];
    const dataRecieved = await getProductsDataFromPubId(id);
    const data: RankedProductData[] = dataRecieved.map((drink, index) => ({
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

export default function Slug({ data }: { data: RankedProductData[] }) {
  const [drinks, setDrinks] = useState<RankedProductData[]>([]);
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
          borderWidth={2}
          borderColor="white"
          textAlign="center"
          focusBorderColor="spoonyblue"
          _hover={{
            borderColor: "spoonyblue",
          }}
          onChange={(e) => handleChange(e)}
        />
        <List w={"full"}>
          {drinks.map((drink, index) => {
            return (
              <SlideFade in={true} delay={index / 10} key={index}>
                <DrinkCard
                  key={index}
                  name={drink.name}
                  abv={drink.abv}
                  rank={drink.rank}
                  portions={drink.portions}
                ></DrinkCard>
              </SlideFade>
            );
          })}
        </List>
      </Flex>
    </Box>
  );
}
