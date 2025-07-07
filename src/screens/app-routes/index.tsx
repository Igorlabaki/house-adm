import React from "react";
import { StyledScrollView, StyledView } from "styledComponents";
import OrganizationListScreen from "./organization";
import NavigationComponent from "@components/navigation";
import { removeUserSave } from "storage/storage-user";
import { ScrollView } from "react-native-gesture-handler";
import FlashMessage from "react-native-flash-message";

export default function AppRoutes() {
  
  return (
    <StyledView className="h-screen w-screen bg-eventhub-background">
      <NavigationComponent />
    </StyledView>
  );
}
