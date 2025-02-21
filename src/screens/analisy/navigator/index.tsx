import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { ProposalAnalysis } from "../proposal-analysis";
import { EventsAnalysis } from "../events-analysis";
import FinancialAnalysisComponent from "../financial-analysis";


const AnalysisTabNavigator = createMaterialTopTabNavigator();

export function AnalysisNavigator() {
  return (
    <AnalysisTabNavigator.Navigator
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
      <AnalysisTabNavigator.Screen name="Eventos" component={EventsAnalysis} />
      <AnalysisTabNavigator.Screen name="Orcamentos" component={ProposalAnalysis} />
     <AnalysisTabNavigator.Screen name="Financeiro" component={FinancialAnalysisComponent} />
    </AnalysisTabNavigator.Navigator>
  );
}
