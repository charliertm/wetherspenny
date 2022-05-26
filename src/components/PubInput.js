import { Box, Center, Flex, Spinner, Text } from "@chakra-ui/react";
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

export default function PubInput(props) {
  const [pickerItems] = useState(pubs);
  const [selectedItems, setSelectedItems] = useState([]);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      setLoading(true);
      setSelectedItems(selectedItems);
      if (selectedItems.length > 0) {
        router.push(selectedItems[0].value.slug);
      }
    }
  };

  const customRender = (selected) => {
    return (
      <Flex flexDir="column" maxW={"160px"}>
        <Text fontWeight={600}>{selected.label} </Text>
        <Text fontWeight={200} fontSize={12}>
          {selected.value.city}
        </Text>
      </Flex>
    );
  };

  return (
    <Box {...props}>
      {loading ? (
        <Center>
          <Spinner speed="0.8s" />
        </Center>
      ) : (
        <CUIAutoComplete
          placeholder="Search for your spoons"
          disableCreateItem={true}
          items={pickerItems}
          selectedItems={selectedItems}
          itemRenderer={customRender}
          onSelectedItemsChange={(changes) =>
            handleSelectedItemsChange(changes.selectedItems)
          }
          inputStyleProps={{
            borderColor: "gray.200",
            focusBorderColor: "dollargreen",
            _hover: {
              borderColor: "dollargreen",
            },
            borderWidth: 2,
          }}
          hideToggleButton={true}
          highlightItemBg={"blue.200"}
          listStyleProps={{
            maxH: "200px",
            overflowX: "hidden",
          }}
          labelStyleProps={{ alignSelf: "center" }}
        />
      )}
    </Box>
  );
}
