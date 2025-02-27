
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ClauseScreen from "./clause-screen";
import ContractScreen from "./contract-screen";

const ContractTabNavigator = createMaterialTopTabNavigator();

export function ContractNavigator() {
  return (
    <ContractTabNavigator.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#1E1F22",
        },
        tabBarInactiveTintColor: "rgb(156 163 175)",
        tabBarActiveTintColor: "rgb(250, 235, 215)",
        tabBarIndicatorStyle: {
          backgroundColor: "rgb(250, 235, 215)",
          height: 2,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "bold", 
        },
      }}
    >
      <ContractTabNavigator.Screen name="Clausulas" component={ClauseScreen} />
      <ContractTabNavigator.Screen name="Contrato" component={ContractScreen} />
    </ContractTabNavigator.Navigator>
  );
}
