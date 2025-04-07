import { TextScreen } from "../screens/text";
import { ServiceScreen } from "../screens/value";
import { ExpenseScreen } from "../screens/despesa";
import { QuestionScreen } from "../screens/question";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { StyledView } from "styledComponents";

const InfoTabNavigator = createMaterialTopTabNavigator();

export function InfoNavigator() {
  return (
    <InfoTabNavigator.Navigator
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
          fontWeight: "bold", // Torne o texto em negrito
        },
      }}
    >
      <InfoTabNavigator.Screen name="Textos" component={TextScreen} />
      <InfoTabNavigator.Screen name="Perguntas" component={QuestionScreen} />
      <InfoTabNavigator.Screen name="Servicos" component={ServiceScreen} />
      <InfoTabNavigator.Screen name="Despesas" component={ExpenseScreen} />
    </InfoTabNavigator.Navigator>
  );
}
