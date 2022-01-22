import { Center, Text, Box, VStack } from "@chakra-ui/react";
import step1 from "../../public/static/step1.jpg";
import step2 from "../../public/static/step2.jpg";
import step3 from "../../public/static/step3.jpg";
import step4 from "../../public/static/step4.jpg";
import Image from "next/image";

export default function AddMeAsAnApp() {
  return (
    <Center w={"full"} p={4}>
      <VStack spacing={10}>
        <Center w={"60%"} pt={2}>
          <Text alignSelf={"center"} alignSelf={"center"}>
            There is no shot this would get added to the App Store. So do this.
            Now.
          </Text>
        </Center>
        <Box boxShadow={"xl"}>
          <Image width={300} height={500} src={step1} />
        </Box>
        <Box boxShadow={"xl"}>
          <Image width={300} height={500} src={step2} />
        </Box>
        <Box boxShadow={"xl"}>
          <Image width={300} height={500} src={step3} />
        </Box>
        <Box boxShadow={"xl"}>
          <Image width={300} height={500} src={step4} />
        </Box>
      </VStack>
    </Center>
  );
}
