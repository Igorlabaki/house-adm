import { View, Text, Image } from "react-native";
import React from "react";
import { StyledPressable } from "styledComponents";
import { useNavigation } from "@react-navigation/native";

interface NavigateButtonProps {
  avatarUrl: string;
}

export default function NavigateButton({avatarUrl}:NavigateButtonProps) {
  const navigation = useNavigation();

  const navigateToVenueTabs = () => {
    navigation.navigate("VenueTabs");
  };
  return (
    <StyledPressable
      className="h-11 w-11 rounded-full bg-transparent overflow-hidden mr-4"
      onPress={() => navigateToVenueTabs()}
    >
      <Image
        source={{
          uri: avatarUrl,
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />
    </StyledPressable>
  );
}
