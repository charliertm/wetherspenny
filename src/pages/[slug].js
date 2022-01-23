import {
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  VStack,
  Icon,
  InputLeftAddon,
} from "@chakra-ui/react";
import { slugs_to_ids } from "../slugs_to_ids";
import fetch from "node-fetch";
import ErrorPage from "next/error";
import DrinkCard from "../components/DrinkCard";
import { useEffect, useState } from "react";
import { FaBeer } from "react-icons/fa";

export default function Slug(props) {
  const [drinks, setDrinks] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    setDrinks(props.data);
  }, [props.data]);

  if (!props.data) {
    return <ErrorPage statusCode={404} />;
  }

  const handleChange = (event) => {
    event.preventDefault();
    setValue(event.target.value);
    // use event.target.value for filter rather than value because state is only available next render
    setDrinks(
      props.data.filter((drink) => {
        return drink.name
          .toLowerCase()
          .includes(event.target.value.toLowerCase());
      })
    );
  };
  return (
    <Center>
      <VStack w={"full"}>
        <Center pt={6} pb={4} pl={4} pr={4} w={"full"}>
          <Input
            placeholder={"Search for your favourites"}
            p={6}
            maxW={"800px"}
            w={"full"}
            bg={"white"}
            boxShadow={"lg"}
            rounded={"lg"}
            borderWidth={2}
            borderColor={"black"}
            onChange={handleChange}
            value={value}
            focusBorderColor={"wetherspoons.500"}
            _hover={{
              borderColor: "wetherspoons.500",
            }}
          />
        </Center>
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
      </VStack>
    </Center>
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
