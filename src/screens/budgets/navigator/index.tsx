import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { PendingScreen } from "../screens/proposal";
import { Concludedcreen } from "../screens/event";

const BudgetTabNavigator = createMaterialTopTabNavigator();

export function BudgetNavigator() {
  return (
    <BudgetTabNavigator.Navigator
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
      <BudgetTabNavigator.Screen name="Orcamentos" component={PendingScreen} />
      <BudgetTabNavigator.Screen name="Eventos" component={Concludedcreen} />
     {/*  <BudgetTabNavigator.Screen name="Analise" component={AnalysiScreen} /> */}
    </BudgetTabNavigator.Navigator>
  );
}
