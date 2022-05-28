import { Box, Flex, Input, List } from "@chakra-ui/react";
import ErrorPage from "next/error";
import fetch from "node-fetch";
import { useEffect, useState } from "react";
import LogoWhite from "../../public/static/LogoWhite.svg";
import DrinkCard from "../components/DrinkCard";
import useLerpColorScroll from "../hooks/useLerpColorScroll";
import { slugs_to_ids } from "../slugs_to_ids";
import theme from "../styles/theme";

export default function Slug(props) {
  const [drinks, setDrinks] = useState([]);
  const color = useLerpColorScroll(
    theme.colors.spoonyblue,
    theme.colors.dollargreen
  );

  useEffect(() => {
    setDrinks(props.data);
  }, [props.data]);

  if (!props.data) {
    return <ErrorPage statusCode={404} />;
  }

  const handleChange = (event) => {
    event.preventDefault();
    setDrinks(
      props.data.filter((drink) => {
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
                abv={drink.abv}
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

export const getServerSideProps = async ({ params, res }) => {
  try {
    const { slug } = params;
    const id = slugs_to_ids[slug];
    const result = await fetch(`https://wetherspenny-api.herokuapp.com/${id}`);
    const dataRecieved = await result.json();
    const data = dataRecieved.map((drink, index) => ({
      ...drink,
      rank: index + 1,
    }));
    return {
      props: { data },
    };
  } catch {
    res.statusCode = 404;
    return {
      props: {},
    };
  }
};
