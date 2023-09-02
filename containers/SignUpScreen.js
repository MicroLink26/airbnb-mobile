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

export default function SignUpScreen({ setToken }) {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  //description

  const ERRORFILLALLFIELDS = "Please fill all fields";
  const ERRORAPI = "User allready exists";
  const ERRORPASSWORDNOTTHESAME = "Passwords must be the same";

  const handleSignUp = async () => {
    //description can be empty
    if (
      email === "" ||
      password === "" ||
      confirmPassword === "" ||
      username === ""
    ) {
      setErrorMessage(ERRORFILLALLFIELDS);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage(ERRORPASSWORDNOTTHESAME);
      return;
    }

    try {
      const response = await axios.post(
        "https://lereacteur-bootcamp-api.herokuapp.com/api/airbnb/user/sign_up",
        { email, password, description, username }
      );

      const userToken = response.data.token;
      const id = response.data.id;

      setToken(userToken, id);
      setToken(userToken);
    } catch (error) {
      setErrorMessage(ERRORAPI);
      console.log(error);
    }
    // const userToken = "secret-token";
    // setToken(userToken);
  };
  return (
    <KeyboardAwareScrollView>
      <View style={styles.container}>
        <View style={styles.loginPanel}>
          <View style={styles.logoPanel}>
            <FontAwesome5 name="airbnb" size={100} color="#EB5A62" />
            <Text style={styles.logoText}>Sign up</Text>
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
              placeholder="Username"
              onChangeText={(text) => {
                setUsername(text);
                setErrorMessage("");
              }}
              value={username}
            />
            <TextInput
              style={styles.inputTextMultiline}
              placeholder="Describe yourself in few words"
              onChangeText={(text) => {
                setDescription(text);
                setErrorMessage("");
              }}
              value={description}
              multiline
              numberOfLines={4}
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
            <TextInput
              style={styles.inputText}
              placeholder="Confirm password"
              secureTextEntry={true}
              onChangeText={(text) => {
                setConfirmPassword(text);
                setErrorMessage("");
              }}
              value={confirmPassword}
            />
          </View>
        </View>
        <View style={styles.buttonsPanel}>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity
            style={styles.signinButton}
            title="Sign in"
            onPress={async () => {
              handleSignUp();
            }}
          >
            <Text>Sign up</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          >
            <Text>Already have an account, Sign in</Text>
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

  inputTextMultiline: {
    height: 100,
    borderColor: "#EB5A62",
    borderWidth: 1,
    padding: 8,
    marginBottom: 10,
    verticalAlign: "top",
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
