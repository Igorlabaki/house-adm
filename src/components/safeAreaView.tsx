import { ReactNode } from "react";
import { Platform } from "react-native";
import { StatusBar } from "expo-status-bar";

import { StyledSafeAreaView, StyledView } from "styledComponents";
interface SafeAreaViewProps{
    children: ReactNode;
}

const ios = Platform.OS === "ios";
export default function SafeAreaViewComponent({children}:SafeAreaViewProps) {
  return (
    <StyledView className='flex-1 bg-blue-50'>
      <StyledSafeAreaView  className={`${ios && "-mb-2"} bg-black`}>
          <StatusBar style='inverted' />
          {children}
      </StyledSafeAreaView>
    </StyledView>
  )
}
