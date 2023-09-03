import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  TextInput,
  StyleSheet,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

export default function ProfileScreen({ setToken, userToken, userId }) {
  const [isLoading, setIsLoading] = useState(true);
  const [userInfos, setUserInfos] = useState({});
  const [imageUri, setImageUri] = useState("");
  const [pictModified, setPictModified] = useState(false);
  const [infosModified, setInfosModified] = useState(false);
  const [updating, setUpdating] = useState(false);

  // -- Récupère les infos de l'utilisateur pour les afficher dès l'arrivée sur l'écran
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        setUserInfos(data);

        if (data.photo) {
          setImageUri(data.photo.url);
        }

        setIsLoading(false);
      } catch (error) {
        console.log(
          "catch profile>>>",
          JSON.stringify(error.response, null, 2)
        );
      }
    };

    fetchData();
  }, []);

  // -- Modifie la bonne clé du state "usrInfos" selon l'input qui est modifié
  const changeUserInfos = (value, inputName) => {
    // -- copie du state
    const newObj = { ...userInfos };

    // -- Modif de la bonne clé
    newObj[inputName] = value;

    setUserInfos(newObj);
    // -- Utilisation de ce state pour savoir qu'au moins un champs a été modifié
    setInfosModified(true);
  };

  // -- Se déclenche au press sur l'icône caméra pour accéder à l'appareil photo
  const getPermissionAndTakePicture = async () => {
    // -- Demande permission à l'utilisateur
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    // console.log(status);
    if (status === "granted") {
      // -- Autorisation accordée => ouverture de la caméra
      const result = await ImagePicker.launchCameraAsync();

      if (result.canceled) {
        // -- Prévient l'utilisateur qu'aucune photo n'est sélectionné
        alert("No picture choosen");
      } else {
        // console.log(result.assets[0].setImageUri);

        // -- Envoie de l'uri au state pour afficher une preview
        setImageUri(result.assets[0].setImageUri);
        // -- Utilisation de ce state pour savoir que l'image a été modifié
        setPictModified(true);
      }
    } else {
      alert("Acces denied");
    }
  };

  // -- Se déclenche au press sur l'icône photo pour accéder à la gallerie photo
  const getPermissionAndGetPicture = async () => {
    // -- Demande permission à l'utilisateur
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status === "granted") {
      // -- Autorisation accordée => ouverture de la gallerie photo
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });

      // console.log(result);
      if (result.canceled) {
        // -- Prévient l'utilisateur qu'aucune photo n'est sélectionné
        alert("no picture choosen");
      } else {
        // console.log(result.assets[0].uri);

        // -- Envoie de l'uri au state pour afficher une preview
        setImageUri(result.assets[0].uri);
        // -- Utilisation de ce state pour savoir que l'image a été modifié
        setPictModified(true);
      }
    } else {
      alert("Access denied");
    }
  };

  // -- Se délclenche au press sur le bouton update
  const handleUpdate = async () => {
    // -- Si au moins, l'image OU une info a été modifié
    if (pictModified || infosModified) {
      setUpdating(true);

      // -- Si une info a été modifié
      if (infosModified) {
        try {
          const { data } = await axios.put(
            "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/update",
            {
              email: userInfos.email,
              description: userInfos.description,
              username: userInfos.username,
            },
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          );

          // console.log("data update infos>>", data);
          setUserInfos(data);
          setUpdating(false);

          alert("infos updated");
        } catch (error) {
          console.log("catch update infos");
        }
      }

      // -- Si l'image a été modifié
      if (pictModified) {
        // console.log(imageUri.split("."));

        // -- Transformation de la string en tableau pour pouvoir récupérer l'extension du fichier
        const tab = imageUri.split(".");

        // -- 👇 Deux méthodes possibles
        // console.log(tab[tab.length - 1]);
        // console.log(tab.at(-1));

        //  Création du formData
        const formData = new FormData();
        formData.append("photo", {
          uri: imageUri,
          name: `mypic.${tab.at(-1)}`,
          type: `image/${tab.at(-1)}`,
        });

        const { data } = await axios.put(
          "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/upload_picture",
          formData,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        // console.log("data updat pict>>", data);
        setImageUri(data.photo.url);
        setUpdating(false);

        alert("pict updated");
      }
    } else {
      // -- Aucune modif faites => prévient l'utilisateur
      alert("no infos to update");
    }
  };

  return isLoading ? (
    <ActivityIndicator />
  ) : (
    <KeyboardAwareScrollView style={styles.container}>
      {/* -- Affichage de la photo s'il y en a une SINON affichage d'un icône */}

      <View style={styles.flexRow}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.avatar} />
        ) : (
          <AntDesign name="user" size={40} color="black" />
        )}
        <View style={styles.flexJustifyCenter}>
          {/* -- Bouton pour ouvrir la caméra */}
          <TouchableOpacity onPress={getPermissionAndTakePicture}>
            <AntDesign name="camera" size={28} color="gray" />
          </TouchableOpacity>

          {/* -- Bouton pour ouvrir la gallerie photo */}
          <TouchableOpacity onPress={getPermissionAndGetPicture}>
            <MaterialIcons name="add-photo-alternate" size={28} color="gray" />
          </TouchableOpacity>
        </View>
      </View>
      <TextInput
        value={userInfos.email}
        style={styles.input}
        onChangeText={(text) => {
          changeUserInfos(text, "email");
        }}
      />

      <TextInput
        value={userInfos.username}
        style={styles.input}
        onChangeText={(text) => {
          changeUserInfos(text, "username");
        }}
      />

      <TextInput
        value={userInfos.description}
        style={styles.textArea}
        multiline
        numberOfLines={4}
        onChangeText={(text) => {
          changeUserInfos(text, "description");
        }}
      />

      {/* -- Affiche le bouton pour l'update OU un loader pendant l'update */}
      {updating ? (
        <ActivityIndicator />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleUpdate}>
          <Text>Update</Text>
        </TouchableOpacity>
      )}

      {/* -- Bouton de déconnexion de l'utilisateur */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setToken(null, null);
        }}
      >
        <Text>Log Out</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    backgroundColor: "white",
  },

  flexRow: { flexDirection: "row", justifyContent: "center", gap: 20 },
  flexJustifyCenter: {
    justifyContent: "space-around",
  },
  input: {
    height: 44,
    borderColor: "#EB5A62",
    borderBottomWidth: 1,
    width: "100%",
    marginVertical: 20,
  },
  textArea: {
    height: 100,
    borderColor: "#EB5A62",
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    verticalAlign: "top",
    width: "100%",
    marginVertical: 20,
  },
  avatar: {
    width: 150,
    height: 150,
  },
  button: {
    borderColor: "#EB5A62",
    borderRadius: 40,
    borderWidth: 2,
    width: 200,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 20,
  },
});
