import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, Entypo, AntDesign } from "@expo/vector-icons";
import HomeScreen from "./containers/HomeScreen";
import ProfileScreen from "./containers/ProfileScreen";
import SignInScreen from "./containers/SignInScreen";
import SignUpScreen from "./containers/SignUpScreen";
import SettingsScreen from "./containers/SettingsScreen";
import SplashScreen from "./containers/SplashScreen";
import { FontAwesome5 } from "@expo/vector-icons";
import RoomScreen from "./containers/RoomScreen";
import AroundMe from "./containers/AroundMe";
import { View, StyleSheet } from "react-native-web";
import BackButton from "./components/BackButton";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const setToken = async (token, id) => {
    if (token) {
      await AsyncStorage.setItem("userToken", token);
      await AsyncStorage.setItem("userId", id);
    } else {
      await AsyncStorage.removeItem("userToken");
      await AsyncStorage.removeItem("userId");
    }
    setUserId(id);
    setUserToken(token);
  };

  useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      // We should also handle error for production apps
      const userToken = await AsyncStorage.getItem("userToken");
      const userId = await AsyncStorage.getItem("userId");
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      setUserToken(userToken);
      setUserId(userId);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading === true) {
    // We haven't finished checking for the token yet
    return null;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {userToken === null ? (
          // No token found, user isn't signed in
          <>
            <Stack.Screen name="SignIn">
              {() => <SignInScreen setToken={setToken} />}
            </Stack.Screen>
            <Stack.Screen name="SignUp">
              {() => <SignUpScreen setToken={setToken} />}
            </Stack.Screen>
          </>
        ) : (
          // User is signed in ! 🎉
          <Stack.Screen name="Tab" options={{ headerShown: false }}>
            {() => (
              <Tab.Navigator
                screenOptions={{
                  headerShown: false,
                  tabBarActiveTintColor: "tomato",
                  tabBarInactiveTintColor: "gray",
                }}
              >
                <Tab.Screen
                  name="TabHome"
                  options={{
                    tabBarLabel: "Home",
                    tabBarIcon: ({ color, size }) => (
                      <Ionicons name={"ios-home"} size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        headerLeft: (props) => <BackButton {...props} />,
                        headerBackVisible: false,
                        // headerRight: () => null,
                        // headerBackTitle: () => null,
                        headerTitleAlign: "center",
                        headerBackTitleVisible: false,
                        headerTitle: (props) => (
                          <FontAwesome5
                            name="airbnb"
                            size={40}
                            color="#EB5A62"
                          />
                        ),
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { color: "white" },
                      }}
                    >
                      <Stack.Screen name="Home">
                        {() => <HomeScreen />}
                      </Stack.Screen>
                      <Stack.Screen name="Room">
                        {() => <RoomScreen />}
                      </Stack.Screen>
                      <Stack.Screen
                        name="Profile"
                        options={{
                          title: "User Profile",
                        }}
                      >
                        {() => <ProfileScreen />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>

                <Tab.Screen
                  name="TabMap"
                  options={{
                    tabBarLabel: "Around Me",
                    tabBarIcon: ({ color, size }) => (
                      <Entypo name="location-pin" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        // headerLeft: (props) => <BackButton {...props} />,
                        // headerRight: () => null,
                        // headerBackTitle: () => null,
                        headerTitleAlign: "center",
                        headerBackTitleVisible: false,
                        headerTitle: (props) => (
                          <FontAwesome5
                            name="airbnb"
                            size={40}
                            color="#EB5A62"
                          />
                        ),
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { color: "white" },
                      }}
                    >
                      <Stack.Screen name="AroundMe" component={AroundMe} />

                      <Stack.Screen
                        name="RoomMap"
                        options={{
                          title: "Room",
                        }}
                      >
                        {(props) => <RoomScreen {...props} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
                <Tab.Screen
                  name="TabSettings"
                  options={{
                    tabBarLabel: "My profile",
                    tabBarIcon: ({ color, size }) => (
                      <AntDesign name="user" size={size} color={color} />
                    ),
                  }}
                >
                  {() => (
                    <Stack.Navigator
                      screenOptions={{
                        // headerLeft: (props) => <BackButton {...props} />,
                        // headerRight: () => null,
                        // headerBackTitle: () => null,
                        headerTitleAlign: "center",
                        headerBackTitleVisible: false,
                        headerTitle: (props) => (
                          <FontAwesome5
                            name="airbnb"
                            size={40}
                            color="#EB5A62"
                          />
                        ),
                        headerStyle: { backgroundColor: "white" },
                        headerTitleStyle: { color: "white" },
                      }}
                    >
                      <Stack.Screen
                        name="Profile"
                        options={{
                          title: "My profile",
                        }}
                      >
                        {(props) => (
                          <ProfileScreen
                            userId={userId}
                            userToken={userToken}
                            setToken={setToken}
                          />
                        )}
                      </Stack.Screen>
                      <Stack.Screen
                        name="Settings"
                        options={{
                          title: "Settings",
                        }}
                      >
                        {() => <SettingsScreen setToken={setToken} />}
                      </Stack.Screen>
                    </Stack.Navigator>
                  )}
                </Tab.Screen>
              </Tab.Navigator>
            )}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  alignCenter: {
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: "auto",
  },
});
