import {
  Button,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import RoomDetail from "../components/RoomDetail";

export default function RoomScreen() {
  const [room, setRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const route = useRoute();

  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/${route.params.id}`
        );

        setRoom(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);
  return (
    <View style={styles.whiteBcg}>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <RoomDetail room={room} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  whiteBcg: {
    backgroundColor: "white",
    height: "100%",
  },
});
