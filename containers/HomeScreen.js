import { useNavigation } from "@react-navigation/core";
import { useEffect, useState } from "react";
import {
  Button,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Image,
} from "react-native";
import axios from "axios";
import Room from "../components/Room";

export default function HomeScreen() {
  const [roomsList, setRoomsList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // const [data, setData] = useState(null);
  useEffect(() => {
    const getData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms`
        );
        //console.log(data[0]);
        setRoomsList(data);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  const navigation = useNavigation();
  return (
    <View>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          style={styles.whiteBcg}
          data={roomsList}
          keyExtractor={(item) => item._id}
          //ListHeaderComponent={() => <Text>Je suis le header</Text>}
          renderItem={({ item }) => {
            return (
              <Room
                imgUrl={item.photos[0].url}
                title={item.title}
                user={item.user}
                stars={item.ratingValue}
                reviews={item.reviews}
                price={item.price}
                id={item._id}
              />
            );
          }}
          //ListFooterComponent={() => <Text>Je suis le footer</Text>}
          // ItemSeparatorComponent={() => <Text>---------------</Text>}
        />
      )}
      {/* <Text>Welcome home!</Text>
      <Button
        title="Go to Profile"
        onPress={() => {
          navigation.navigate("Profile", { userId: 123 });
        }}
      /> */}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 32,
  },
  images: {
    height: 200,
    width: "100%",
  },
  whiteBcg: {
    backgroundColor: "white",
  },
});
