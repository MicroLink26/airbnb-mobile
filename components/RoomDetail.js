import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
const Room = ({ room }) => {
  const [lines, setLines] = useState(3);
  const navigation = useNavigation();

  const starsList = [];

  for (let i = 1; i <= 5; i++) {
    if (i <= room.ratingValue)
      starsList.push(
        <FontAwesome key={i} name="star" size={10} color="gold" />
      );
    else
      starsList.push(
        <FontAwesome key={i} name="star" size={10} color="gray" />
      );
  }
  return (
    <View style={styles.roomContainer}>
      <Image
        style={styles.images}
        resizeMode="contain"
        source={{
          uri: room.photos[0].url,
        }}
      />

      <View style={styles.absolute}>
        <Text style={styles.price}>{room.price} €</Text>
      </View>

      <View style={styles.flexRow}>
        <View style={styles.roomTxt}>
          <Text numberOfLines={1} style={styles.title}>
            {room.title}
          </Text>
          <Text style={styles.starContainer}>
            {starsList.map((item) => item)} {room.reviews} reviews
          </Text>
        </View>
        <Image
          style={styles.roundedImage}
          resizeMode="contain"
          source={{
            uri: room.user.account.photo.url,
          }}
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          setLines(lines === 0 ? 3 : 0);
        }}
      >
        <Text numberOfLines={lines}>{room.description}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Room;

const styles = StyleSheet.create({
  roomContainer: {
    padding: 20,
    // borderBottomColor: "gray",
    // borderBottomWidth: 1,

    // alignItems: "center",

    //justifyContent: "center",
  },

  images: {
    height: 250,
    width: "100%",

    resizeMode: "cover",
  },
  roundedImage: {
    borderRadius: 50,
    height: 80,
    width: 80,
  },
  flexRow: {
    flexDirection: "row",
  },
  roomTxt: {
    flex: 1,
    //width: 200,
  },
  price: {
    //marginTop: -60,
    backgroundColor: "black",
    //marginBottom: 20,
    width: 80,
    color: "white",
    padding: 10,
  },
  absolute: {
    position: "absolute",
    top: 200,
    left: 20,
  },
  title: {
    fontSize: 20,
  },
  starContainer: {
    color: "gray",
    paddingVertical: 20,
  },
});
