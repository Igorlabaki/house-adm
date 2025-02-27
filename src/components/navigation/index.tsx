import MenuComponent from "./menu";
import { Image } from "react-native";
import React, { useState } from "react";
import { RootState } from "@store/index";
import { VenueTabs } from "./venue-tabs";
import { useSelector } from "react-redux";
import { User } from "@store/auth/authSlice";
import { Venue } from "@store/venue/venueSlice";
import VenueMenu from "screens/app-routes/venue/byId/menu";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import OrganizationMenu from "@components/organization/menu";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SelectedVenueScreen from "screens/app-routes/venue/byId";
import { Organization } from "@store/organization/organizationSlice";
import OrganizationListScreen from "screens/app-routes/organization";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SelectedOrganizationScreen } from "screens/app-routes/organization/byId";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import OwnerScreenComponent from "screens/app-routes/owner/ownerScreen";
import ContactScreenComponent from "screens/app-routes/contact";
import ContractScreen from "@components/contract";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export default function AppNavigator() {
  const [menuModalIsOpen, setMenuModalIsOpen] = useState<boolean>(false);
  const [organizationModalIsOpen, setorganizationModalIsOpen] =
    useState<boolean>(false);
  const [venueModalIsOpen, setvenueModalIsOpen] = useState<boolean>(false);
  const [title, setTitle] = useState("");
  const user: User = useSelector((state: RootState) => state?.user.user);
  const organization: Organization = useSelector(
    (state: RootState) => state?.organizationList.organization
  );
  const venue: Venue = useSelector(
    (state: RootState) => state?.venueList.venue
  );

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: "#1E1F22",
          },
          headerTitleStyle: {
            color: "#fff",
          },
          headerLeft: () => {
            return <StyledText>{title}</StyledText>;
          },
          headerRight: () => {
            if (user?.avatarUrl) {
              return (
                <StyledPressable
                  className="h-11 w-11 rounded-full bg-transparent overflow-hidden mr-4"
                  onPress={() => setMenuModalIsOpen(true)}
                >
                  <Image
                    source={{ uri: user.avatarUrl }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                </StyledPressable>
              );
            }
            return (
              <StyledPressable
                className="mr-2"
                onPress={() => setMenuModalIsOpen(true)}
              >
                <FontAwesome5 name="user-circle" size={24} color="white" />
              </StyledPressable>
            );
          },
        }}
      >
        <Stack.Screen
          name="OrganizationList"
          component={OrganizationListScreen}
          options={{
            title: "",
            headerLeft: () => {
              return (
                <StyledText className="text-white font-semibold text-lg">
                  Suas Organizacoes
                </StyledText>
              );
            },
          }}
        />

        <Stack.Screen
          name="OwnersScreen"
          component={OwnerScreenComponent}
          options={{
            title: "",
            headerLeft: () => {
              return (
                <StyledText className="text-white font-semibold text-lg">
                  Proprietarios
                </StyledText>
              );
            },
          }}

        />

        <Stack.Screen
          name="ContractScreen"
          component={ContractScreen}
          options={{
            title: "",
            headerLeft: () => {
              return (
                <StyledText className="text-white font-semibold text-lg">
                  Contrato
                </StyledText>
              );
            },
          }}

        />
        <Stack.Screen
          name="ContactScreen"
          component={ContactScreenComponent}
          options={{
            title: "",
            headerLeft: () => {
              return (
                <StyledText className="text-white font-semibold text-lg">
                  Contatos
                </StyledText>
              );
            },
          }}
        />
        <Stack.Screen
          name="VenueTabs"
          component={VenueTabs}
          options={{ title: "Venue" }}
        />

        <Stack.Screen
          name={"SelectedOrganization"}
          component={SelectedOrganizationScreen}
          options={{
            title: "",
            headerLeft: () => {
              return (
                <StyledView className="flex flex-row gap-x-4 justify-center items-center">
                  <StyledText className="text-white font-semibold text-lg">
                    {organization.name}
                  </StyledText>
                  <StyledPressable
                    onPress={() => setorganizationModalIsOpen(true)}
                  >
                    <Ionicons name="menu" size={20} color="white" />
                  </StyledPressable>
                </StyledView>
              );
            },
          }}
        />
        <Stack.Screen
          name={"SelectedVenue"}
          component={SelectedVenueScreen}
          options={{
            title: "",
            headerLeft: () => {
              return (
                <StyledView className="flex flex-row gap-x-4 justify-center items-center">
                  <StyledText className="text-white font-semibold text-lg">
                    {venue.name}
                  </StyledText>
                  <StyledPressable onPress={() => setvenueModalIsOpen(true)}>
                    <Ionicons name="menu" size={20} color="white" />
                  </StyledPressable>
                </StyledView>
              );
            },
          }}
        />
      </Stack.Navigator>
      {menuModalIsOpen && (
        <MenuComponent
          isModalOpen={menuModalIsOpen}
          setMenuModalIsOpen={setMenuModalIsOpen}
        />
      )}
      {organizationModalIsOpen && (
        <OrganizationMenu
          isModalOpen={organizationModalIsOpen}
          setMenuModalIsOpen={setorganizationModalIsOpen}
        />
      )}
      {venueModalIsOpen && (
        <VenueMenu
          isModalOpen={venueModalIsOpen}
          setMenuModalIsOpen={setvenueModalIsOpen}
        />
      )}
    </NavigationContainer>
  );
}

{
  /* <Tab.Navigator
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
    </Tab.Navigator> */
}
