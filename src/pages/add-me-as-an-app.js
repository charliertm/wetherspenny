import { Box, Center, Text, VStack } from "@chakra-ui/react";
import Image from "next/image";
import LogoWhite from "../../public/static/LogoWhite.svg";
import step1 from "../../public/static/steps/step1.png";
import step2 from "../../public/static/steps/step2.png";
import step3 from "../../public/static/steps/step3.png";
import step4 from "../../public/static/steps/step4.png";
import useLerpColorScroll from "../hooks/useLerpColorScroll";
import theme from "../styles/theme";

const StepCard = ({ src, alt, label, color }) => {
  return (
    <Box alignContent={"center"} bg="white" p={8} rounded={"md"}>
      <Text textColor={color} fontWeight={"semibold"} pb={4}>
        {label}
      </Text>
      <Image width={300} height={500} src={src} alt={alt} />
    </Box>
  );
};

export default function AddMeAsAnApp() {
  const color = useLerpColorScroll(
    theme.colors.spoonyblue,
    theme.colors.dollargreen
  );
  const inverseColor = useLerpColorScroll(
    theme.colors.dollargreen,
    theme.colors.spoonyblue
  );

  return (
    <Center w={"full"} bgColor={color}>
      <VStack spacing={8} py={12}>
        <LogoWhite />
        <StepCard
          src={step1}
          alt={"step 1"}
          label={"Step 1 - Press this!"}
          color={inverseColor}
        />
        <StepCard
          src={step2}
          alt={"step 2"}
          label={"Step 2 - Press Add to Home Screen"}
          color={inverseColor}
        />
        <StepCard
          src={step3}
          alt={"step 3"}
          label={"Step 3 - Press Add"}
          color={inverseColor}
        />
        <StepCard
          src={step4}
          alt={"step 4"}
          label={"Step 4 - Admire!"}
          color={inverseColor}
        />
      </VStack>
    </Center>
  );
}
