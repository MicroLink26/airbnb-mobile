import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
const BackButton = (props) => {
  const navigation = useNavigation();

  const handleBack = () => {
    navigation.goBack();
  };
  return props.canGoBack ? (
    <TouchableOpacity onPress={handleBack}>
      <Ionicons name="arrow-back" size={24} color="black" />
    </TouchableOpacity>
  ) : (
    <></>
  );
};

export default BackButton;
