import { TextScreen } from '../screens/text';
import { ValueScreen } from '../screens/value';
import { QuestionScreen } from '../screens/question';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { DespesaScreen } from '../screens/despesa';

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
        name="Textos"
        component={TextScreen}
      />
      <InfoTabNavigator.Screen
        name="Perguntas"
        component={QuestionScreen}
      />
      <InfoTabNavigator.Screen
        name="Valores"
        component={ValueScreen}
      />
      <InfoTabNavigator.Screen
        name="Despesas"
        component={DespesaScreen}
      />
    </InfoTabNavigator.Navigator>
  )
}
