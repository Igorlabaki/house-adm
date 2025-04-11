import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import SurchargeScreenComponent from '../surcharge';
import DiscountScreenComponent from '../discount';
import GoalScreenComponent from '../goals';

const InfoTabNavigator = createMaterialTopTabNavigator();

export  function SeasonalFeeNavigator() {
  return (
    <InfoTabNavigator.Navigator 
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#1E1F22',
        },
        tabBarInactiveTintColor: "rgb(156 163 175)",
        tabBarActiveTintColor: "rgb(250, 235, 215)",
        tabBarIndicatorStyle: {
          backgroundColor: "rgb(250, 235, 215)",
          height: 2
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "bold", // Torne o texto em negrito
        },
      }}
    >
      <InfoTabNavigator.Screen
        name="Adicionais"
        component={SurchargeScreenComponent}
      />
      <InfoTabNavigator.Screen
        name="Descontos"
        component={DiscountScreenComponent}
      />
      <InfoTabNavigator.Screen
        name="Metas"
        component={GoalScreenComponent}
      />
    </InfoTabNavigator.Navigator>
  )
}
