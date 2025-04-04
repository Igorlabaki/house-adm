import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import AuthRoutes from "screens/auth-routes";
import AppRoutes from "screens/app-routes";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const navigation = useNavigation();
  const session = useSelector((state: RootState) => state?.session.session);

  useEffect(() => {
    if (session?.id) {
      navigation.navigate("AppRoutes"); // Redireciona para AppRoutes se houver sessão
    } else {
      navigation.navigate("AuthRoutes"); // Redireciona para AuthRoutes se não houver sessão
    }
  }, [session?.id, navigation]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AuthRoutes" component={AuthRoutes} />
      <Stack.Screen name="AppRoutes" component={AppRoutes} />
    </Stack.Navigator>
  );
}