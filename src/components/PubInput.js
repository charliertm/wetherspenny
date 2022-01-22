import { useState } from "react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { useRouter } from "next/router";
import { pubs_info } from "../pubs_info";
import { Box, Flex, Text } from "@chakra-ui/react";

const pubs = pubs_info.map((pub) => {
  return {
    value: pub,
    label: pub.name,
  };
});

export default function PubInput(props) {
  const [pickerItems, setPickerItems] = useState(pubs);
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      setSelectedItems(selectedItems);
      if (selectedItems.length > 0) {
        router.push(selectedItems[0].value.slug);
      }
    }
  };

  const customRender = (selected) => {
    return (
      <Flex flexDir="column">
        <Text fontWeight={600}>{selected.label} </Text>
        <Text fontWeight={200} fontSize={12}>
          {selected.value.city}
        </Text>
      </Flex>
    );
  };

  return (
    <Box {...props}>
      <CUIAutoComplete
        label="Choose your spoons"
        placeholder="Name of your Spoons"
        disableCreateItem={true}
        items={pickerItems}
        selectedItems={selectedItems}
        itemRenderer={customRender}
        onSelectedItemsChange={(changes) =>
          handleSelectedItemsChange(changes.selectedItems)
        }
        inputStyleProps={{
          borderColor: "grey.100",
          focusBorderColor: "wetherspoons.500",
          _hover: {
            borderColor: "wetherspoons.500",
          },
          borderWidth: 2,
        }}
        hideToggleButton={true}
        highlightItemBg={"blue.200"}
        listStyleProps={{ maxH: "200px", overflowX: "hidden" }}
        labelStyleProps={{ alignSelf: "center" }}
      />
    </Box>
  );
}
