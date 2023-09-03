import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import axios from "axios";

import { useEffect, useState } from "react";

const AroundMe = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [roomsList, setRoomsList] = useState([]);
  const [coords, setCoords] = useState({
    latitude: 48.856614,
    longitude: 2.3522219,
  });

  useEffect(() => {
    const askPermissionAndGetCoords = async () => {
      // -- Demande de permission d'accés à la localisation
      const { status } = await Location.requestForegroundPermissionsAsync();
      // console.log("status>>>", status);

      let latitude = "";
      let longitude = "";

      if (status === "granted") {
        // -- Pour la position actuelle
        // const result = await Location.getCurrentPositionAsync();

        // -- Pour la dernière position connue
        const result = await Location.getLastKnownPositionAsync();
        console.log("result>>", result);

        latitude = result?.coords?.latitude || 48.856614;
        longitude = result?.coords?.longitude || 2.3522219;

        setCoords({
          latitude: result?.coords?.latitude || 48.856614,
          longitude: result?.coords?.longitude || 2.3522219,
        });
      } else {
        alert("Acces denied, using Paris coords");
      }
      // console.log("cords -->", coords.latitude, coords.longitude);
      // -- Les query de la reuqête seront vide selon si l'utilisateur a accepté de partager sa position => si on a modifier les variables "latitude" et "longitude"
      try {
        const { data } = await axios.get(
          latitude
            ? `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/around?latitude=${coords.latitude}&longitude=${coords.longitude}`
            : `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/rooms/`
        );

        console.log("data>>>", data.length);
        setRoomsList(data);
        setIsLoading(false);
        if (data.length < 1) alert("No rooms around You!");
      } catch (error) {
        console.log("catch>>", error);
      }
    };
    askPermissionAndGetCoords();
  }, []);

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <MapView
      style={styles.map}
      initialRegion={{
        latitude: coords.latitude,
        longitude: coords.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
      }}
      showsUserLocation={true}
    >
      {roomsList.map((room) => {
        return (
          <Marker
            key={room._id}
            coordinate={{
              latitude: room.location[1],
              longitude: room.location[0],
            }}
            onPress={() => {
              // -- Au press sur un pin on navigue vers l'écran RoomMap que l'on a ajouté dans l'onglet TabMap
              navigation.navigate("RoomMap", { roomId: room._id });
            }}
          />
        );
      })}
    </MapView>
  );
};

export default AroundMe;

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});
