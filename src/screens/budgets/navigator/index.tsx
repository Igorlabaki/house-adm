import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { PendingScreen } from "../screens/proposal";
import { Concludedcreen } from "../screens/event";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";

const BudgetTabNavigator = createMaterialTopTabNavigator();

const screens = [
  { name: "Orcamentos", component: PendingScreen, permission: "VIEW_EVENTS"},
  { name: "Eventos", component: Concludedcreen, permission: "VIEW_PROPOSALS"},
];

export function BudgetNavigator() {
   const venue = useSelector(
      (state: RootState) => state.venueList.venue
    );

    console.log(venue?.permissions)
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
      {
        screens.filter(screen => venue?.permissions?.includes(screen.permission)).map(({ name, component }) => {
          return (
            <BudgetTabNavigator.Screen name={name} component={component} key={name}/>
          )
        })
      }
    </BudgetTabNavigator.Navigator>
  );
}
