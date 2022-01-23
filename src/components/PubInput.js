import { useState } from "react";
import { CUIAutoComplete } from "chakra-ui-autocomplete";
import { useRouter } from "next/router";
import { pubs_info } from "../pubs_info";
import {
  Box,
  Center,
  Container,
  Flex,
  Spinner,
  Text,
  theme,
} from "@chakra-ui/react";

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
  const [loading, SetLoading] = useState(false);

  const handleSelectedItemsChange = (selectedItems) => {
    if (selectedItems) {
      SetLoading(true);
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
    <Container {...props}>
      {loading ? (
        <Center>
          <Spinner speed="0.8s" />
        </Center>
      ) : (
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
            borderColor: theme.colors.blackAlpha["400"],
            focusBorderColor: "wetherspoons.500",
            _hover: {
              borderColor: "wetherspoons.500",
            },
            borderWidth: 1,
            boxShadow: "md",
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
    </Container>
  );
}
