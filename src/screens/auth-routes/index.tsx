import Toast from "react-native-toast-message";
import React, { useState } from "react";
import { StyledPressable, StyledText, StyledView } from "styledComponents";

import RegisterForm from "./register";
import Feather from "@expo/vector-icons/Feather";
import LoginForm from "./login";

export default function AuthRoutes() {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <StyledView className="bg-eventhub-background flex flex-col h-screen w-screen justify-center items-center px-3 py-5">
      <StyledView className="flex flex-row justify-center items-baseline gap-x-2">
        <Feather name="calendar" size={32} color="#6366f1" />
        <StyledText className="font-bold text-3xl text-eventhub-primary ">
          EventHub
        </StyledText>
      </StyledView>
      <StyledText className="text-center text-eventhub-primaryDark font-semibold">
        Seu hub para gestão de eventos
      </StyledText>
      {isRegister ? (
        <RegisterForm onSwitchToLogin={() => setIsRegister(false)} />
      ) : (
        <LoginForm onSwitchToRegister={() => setIsRegister(true)} />
      )}
    </StyledView>
  );
}
