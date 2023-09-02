import { useNavigation } from "@react-navigation/core";
import {
  Button,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import Constants from "expo-constants";
import axios from "axios";

export default function SignInScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleSignIn = async () => {
    if (email === "" || password === "") {
      setErrorMessage("Please fill all fields");
      return;
    }

    try {
      const response = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/log_in",
        { email, password }
      );

      const userToken = response.data.token;
      const id = response.data.id;

      setToken(userToken, id);
    } catch (error) {
      setErrorMessage("You have entered an invalid username or password");
    }
  };
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.loginPanel}>
          <View style={styles.logoPanel}>
            <FontAwesome5 name="airbnb" size={100} color="#EB5A62" />
            <Text style={styles.logoText}>Sign in</Text>
          </View>
          <View style={styles.inputZone}>
            <TextInput
              style={styles.inputText}
              placeholder="Email"
              onChangeText={(text) => {
                setEmail(text);
                setErrorMessage("");
              }}
              value={email}
            />

            <TextInput
              style={styles.inputText}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(text) => {
                setPassword(text);
                setErrorMessage("");
              }}
              value={password}
            />
          </View>
        </View>
        <View style={styles.buttonsPanel}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.signinButton}
            title="Sign in"
            onPress={async () => {
              handleSignIn();
            }}
          >
            <Text>Sign in</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignUp");
            }}
          >
            <Text>Create an account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    paddingHorizontal: 40,
  },
  loginPanel: {
    alignItems: "center",
    justifyContent: "center",
  },
  logoPanel: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 100,
  },
  logoText: {
    fontSize: 24,
  },
  inputZone: {
    width: "100%",
    paddingVertical: 80,
  },

  inputText: {
    height: 44,
    borderColor: "#EB5A62",
    borderBottomWidth: 1,

    marginBottom: 10,
  },
  signinButton: {
    borderColor: "#EB5A62",
    borderRadius: 40,
    borderWidth: 2,
    width: 200,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonsPanel: {
    alignItems: "center",
    gap: 10,
  },
  errorMessage: {
    color: "red",
  },
});
