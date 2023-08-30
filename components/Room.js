import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const Room = ({ imgUrl, title, price, stars, reviews, user, id }) => {
  const navigation = useNavigation();
  const starsList = [];
  //console.log(stars);
  for (let i = 1; i <= 5; i++) {
    if (i <= stars)
      starsList.push(
        <FontAwesome key={i} name="star" size={12} color="gold" />
      );
    else
      starsList.push(
        <FontAwesome key={i} name="star" size={12} color="gray" />
      );
  }
  return (
    <TouchableOpacity onPress={() => navigation.push("Room", { id })}>
      <View style={styles.roomContainer}>
        <Image
          style={styles.images}
          resizeMode="contain"
          source={{
            uri: imgUrl,
          }}
        />
        <View style={styles.absolute}>
          <Text style={styles.price}>{price} €</Text>
        </View>
        <View style={styles.flexRow}>
          <View style={styles.roomTxt}>
            <Text numberOfLines={1} style={styles.title}>
              {title}
            </Text>
            <Text style={styles.starContainer}>
              {starsList.map((item) => item)} {reviews} reviews
            </Text>
          </View>
          <Image
            style={styles.roundedImage}
            resizeMode="contain"
            source={{
              uri: user.account.photo.url,
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default Room;

const styles = StyleSheet.create({
  roomContainer: {
    padding: 20,
    borderBottomColor: "gray",
    borderBottomWidth: 1,

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
