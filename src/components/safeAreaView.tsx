import { ReactNode } from "react";
import { StatusBar } from "expo-status-bar";
import { Platform, SafeAreaView, View } from "react-native";

interface SafeAreaViewProps{
    children: ReactNode;
}

const ios = Platform.OS === "ios";
export default function SafeAreaViewComponent({children}:SafeAreaViewProps) {
  return (
    <View className='flex-1 bg-gray-reg'>
      <SafeAreaView  className={`${ios && "-mb-2"} bg-black`}>
          <StatusBar style='inverted' />
          {children}
      </SafeAreaView>
    </View>
  )
}
