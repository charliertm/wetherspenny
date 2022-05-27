import { Box, Flex, Text } from "@chakra-ui/react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { useRouter } from "next/router";
import { useState } from "react";
import { pubs_info } from "../pubs_info";

const pubs = pubs_info.map((pub) => {
  return {
    value: pub,
    label: pub.name,
  };
});

export default function PubInput({ handleLoading, ...props }) {
  const [pickerItems] = useState(pubs);
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      handleLoading();
      setSelectedItems(selectedItems);
      console.log("pushing !");
      if (selectedItems.length > 0) {
        router.push(selectedItems[0].value.slug);
      }
    }
  };

  const customRender = (selected) => {
    return (
      <Flex flexDir="column" width="full">
        <Text fontWeight={"bold"} textColor={"white"}>
          {selected.label}{" "}
        </Text>
        <Text fontWeight={"light"} fontSize={"sm"} textColor={"white"}>
          {selected.value.city}
        </Text>
      </Flex>
    );
  };

  return (
    <Box {...props}>
      <CUIAutoComplete
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
