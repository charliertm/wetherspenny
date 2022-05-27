import { Button, HStack, Skeleton, Text } from "@chakra-ui/react";
import havershine from "haversine-distance";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BiCurrentLocation } from "react-icons/bi";
import { pubs_info } from "../pubs_info";

export default function PubLocator({ handleLoading }) {
  const [closestPub, setClosestPub] = useState();
  const [geoAvailable, setGeoAvailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    if ("geolocation" in navigator) {
      setGeoAvailable(true);
    } else {
      setGeoAvailable(false);
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        const distances = pubs_info.map((pub) => {
          const pubLocation = (({ latitude, longitude }) => ({
            latitude,
            longitude,
          }))(pub);
          return havershine(userLocation, pubLocation);
        });
        const minDistance = Math.min(...distances);
        const closestPubIndex = distances.indexOf(minDistance);
        setClosestPub(pubs_info[closestPubIndex]);
        setGeoAvailable(true);
        setLoading(false);
      },
      (error) => {
        console.error(error.message);
        setGeoAvailable(false);
        setLoading(false);
      }
    );
  }, []);

  return (
    <Button
      bgColor={"spoonyblue"}
      disabled={!geoAvailable || loading}
      w={"full"}
      size={"lg"}
      onClick={() => {
        router.push(closestPub.slug);
        handleLoading();
      }}
    >
      <HStack>
        <BiCurrentLocation color="white" />
        {loading ? (
          <Skeleton w={28} h={4} />
        ) : (
          <Text textColor={"white"} fontWeight={600}>
            {geoAvailable ? closestPub.name : "Location unavailable"}
          </Text>
        )}
      </HStack>
    </Button>
  );
}
