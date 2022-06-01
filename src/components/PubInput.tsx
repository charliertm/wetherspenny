import { Box, Flex, Text } from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { useRouter } from "next/router";
import { useState } from "react";
import { pubInfoData, pubsInfo } from "../data/pubsInfo";

const pubItems = pubsInfo.map((pub: pubInfoData) => {
  return {
    value: pub.slug,
    label: `${pub.name} | ${pub.city}`,
  };
});

type Item = {
  value: string;
  label: string;
};

type PubInputProbs = {
  handleLoading: () => void;
};

export default function PubInput({ handleLoading }: PubInputProbs) {
  const [pickerItems] = useState<Item[]>(pubItems);
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const router = useRouter();

  const handleSelectedItemsChange = (selectedItems?: Item[]) => {
    if (selectedItems) {
      handleLoading();
      setSelectedItems(selectedItems);
      if (selectedItems.length > 0) {
        router.push(selectedItems[0].value);
      }
    }
  };

  const customRender = (selected: Item) => {
    return (
      <Flex flexDir="column" width="full">
        <Text fontWeight={"bold"} textColor={"white"}>
          {selected.label.split("|")[0]}{" "}
        </Text>
        <Text fontWeight={"light"} fontSize={"sm"} textColor={"white"}>
          {selected.label.split("|")[1]}
        </Text>
      </Flex>
    );
  };

  return (
    <Box w={"full"}>
      <CUIAutoComplete
        label=""
        disableCreateItem={true}
        items={pickerItems}
        selectedItems={selectedItems}
        itemRenderer={customRender}
        onSelectedItemsChange={(changes) =>
          handleSelectedItemsChange(changes.selectedItems)
        }
        placeholder="Search for your spoons"
        inputStyleProps={{
          color: "dollargreen",
          _placeholder: {
            opacity: 0.4,
            color: "inherit",
          },
          size: "lg",
          textAlign: "center",
          borderColor: "dollargreen",
          fontWeight: "semibold",
          focusBorderColor: "dollargreen",
          _hover: {
            borderColor: "dollargreen",
          },
          borderWidth: 2,
        }}
        hideToggleButton={true}
        listStyleProps={{
          maxH: "200px",
          overflowX: "hidden",
          bgColor: "dollargreen",
        }}
        labelStyleProps={{ alignSelf: "center" }}
      />
    </Box>
  );
}
