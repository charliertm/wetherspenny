import { Center, List } from "@chakra-ui/react";
import { slugs_to_ids } from "../slugs_to_ids";
import fetch from "node-fetch";
import ErrorPage from "next/error";
import DrinkCard from "../components/DrinkCard";

export default function Slug(props) {
  if (!props.data) {
    return <ErrorPage statusCode={404} />;
  }
  return (
    <Center>
      <List>
        {props.data.map((drink, index) => {
          return (
            <DrinkCard
              key={index}
              name={drink.name}
              abv={drink.abv}
              rank={index + 1}
              portions={drink.portions}
            ></DrinkCard>
          );
        })}
      </List>
    </Center>
  );
}

export const getServerSideProps = async ({ params, res }) => {
  try {
    const { slug } = params;
    const id = slugs_to_ids[slug];
    const result = await fetch(`https://wetherspenny-api.herokuapp.com/${id}`);
    const data = await result.json();
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
