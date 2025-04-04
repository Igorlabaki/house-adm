import { ReactNode } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

import { StyledSafeAreaView, StyledView } from "styledComponents";
interface SafeAreaViewProps {
  children: ReactNode;
}

const ios = Platform.OS === "ios";
export default function SafeAreaViewComponent({ children }: SafeAreaViewProps) {
  return (
    <StyledView className="bg-gray-dark flex-1 flex flex-col h-full w-full">
      <StyledSafeAreaView className={`${ios && "-mb-2"} bg-black`}>
        <StatusBar style="inverted" />
        {children}
      </StyledSafeAreaView>
    </StyledView>
  );
}
