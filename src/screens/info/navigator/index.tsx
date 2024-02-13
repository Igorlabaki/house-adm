import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { TextScreen } from '../screens/text';
import { QuestionScreen } from '../screens/question';
import { ValueScreen } from '../screens/value';



const InfoTabNavigator = createMaterialTopTabNavigator();

export  function InfoNavigator() {
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
          fontSize: 10
        },
      }}
    >
      <InfoTabNavigator.Screen
        name="Texts"
        component={TextScreen}
      />
      <InfoTabNavigator.Screen
        name="Questions"
        component={QuestionScreen}
      />
      <InfoTabNavigator.Screen
        name="Values"
        component={ValueScreen}
      />
    </InfoTabNavigator.Navigator>
  )
}
