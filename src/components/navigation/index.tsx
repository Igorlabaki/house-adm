import { InfoScreen } from "../../screens/info";
import { HomeScreen } from "../../screens/home";
import { Image, Text, View } from "react-native";
import { ImageScreen } from "../../screens/images";
import { BudgetScreen } from "../../screens/budgets";
import { CalendarioMainScreen } from "../../screens/calendar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MaterialCommunityIcons,
  Octicons,
  MaterialIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";

const Tab = createBottomTabNavigator();

export default function NavigationComponent() {
  return (
    <NavigationContainer>
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: "#1E1F22",
        },
        headerTitleStyle: {
          fontWeight: "bold",
          fontSize: 20,
          color: "rgb(156 163 175)",
        },
        headerTitle: "",
        headerTitleAlign: "center",
        headerLeft: () => (
          <Image
            source={{
              uri: "https://res.cloudinary.com/dcjkvwbvh/image/upload/v1699297655/vpyhnm1o0zsfsj8httyz.png",
            }}
            resizeMode="contain"
            className={"w-[100px] h-[50px] ml-2"}
          />
        ),
        headerRight: () => (
          <View className="mr-2">
            <Text className="text-white text-[11px]">Sair</Text>
          </View>
        ),
        tabBarStyle: {
          backgroundColor: "#1E1F22",
          height: 70,
          paddingTop: 10,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "500",
        },
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
      <Tab.Screen
        name="Image"
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
        name="Budget"
        component={BudgetScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="attach-money" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarioMainScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <AntDesign name="calendar" size={20} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  </NavigationContainer>
  )
}
