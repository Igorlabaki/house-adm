
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { ScheduleScreen } from '../screens/schedule';
import { CalendarSectionScreen } from '../screens/calendarSection';

const CalendarTabNavigator = createMaterialTopTabNavigator();

export  function CalendarNavigator() {
  return (
    <CalendarTabNavigator.Navigator 
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
      <CalendarTabNavigator.Screen
        name="Schedule"
        component={ScheduleScreen}
      />
      <CalendarTabNavigator.Screen
        name="Calendar"
        component={CalendarSectionScreen}
      />
    </CalendarTabNavigator.Navigator>
  )
}
