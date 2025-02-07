
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import GuestScreen from '../guest-screen';
import WorkerScreen from '../worker-screen';

const InfoTabNavigator = createMaterialTopTabNavigator();

export  function PersonNavigator() {
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
        name="Convidados"
        component={GuestScreen}
      />
      <InfoTabNavigator.Screen
        name="Colaboradores"
        component={WorkerScreen}
      />
    </InfoTabNavigator.Navigator>
  )
}
