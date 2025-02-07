import Toast from "react-native-toast-message";
import React from "react";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import AuthForm from "./auth-form";

export default function AuthRoutes() {
  return (
    <StyledView className="bg-gray-dark flex flex-col h-screen w-screen px-3 py-5">
      <AuthForm />
    </StyledView>
  );
}
