import React from "react";
import { HomeScreen } from "screens/home";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import { logout } from "@store/auth/authSlice";
import { InfoScreen } from "../../screens/info";
import { ImageScreen } from "../../screens/images";
import { BudgetScreen } from "../../screens/budgets";
import { CalendarioMainScreen } from "../../screens/calendar";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyledImage, StyledPressable, StyledText } from "styledComponents";
import { ProposaInfoScreen } from "screens/budgets/screens/proposal/components/modal/info";
import {
  MaterialCommunityIcons,
  Octicons,
  MaterialIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Configuração de Tabs
export function VenueTabs() {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: "#1E1F22" },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
          color: "rgb(156 163 175)",
        },
        headerTitle: "",
        headerTitleAlign: "center",
        headerLeft: () => (
          <StyledImage
            source={{
              uri: "https://res.cloudinary.com/dcjkvwbvh/image/upload/v1699297655/vpyhnm1o0zsfsj8httyz.png",
            }}
            resizeMode="contain"
            className={"w-[100px] h-[50px] ml-2"}
          />
        ),
        headerRight: () => (
          <StyledPressable className="mr-2" onPress={() => dispatch(logout())}>
            <StyledText className="text-white text-[11px]">Sair</StyledText>
          </StyledPressable>
        ),
        tabBarStyle: {
          backgroundColor: "#1E1F22",
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarLabelStyle: { fontSize: 13, fontWeight: "500" },
        tabBarActiveTintColor: "rgb(250, 235, 215)",
        tabBarInactiveTintColor: "rgb(156 163 175)",
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="home-outline"
              size={25}
              color={color}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ProposaInfoScreen"
        component={ProposaInfoScreen}
        options={{
          title: "Ocamento",
        }}
      />
      <Tab.Screen
        name="Imagens"
        component={ImageScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Octicons name="image" size={18} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Info"
        component={InfoScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="information-sharp" size={25} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Orcam."
        component={BudgetScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="attach-money" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Agenda"
        component={CalendarioMainScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
