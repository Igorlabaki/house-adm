import React, { useEffect } from "react";
import { HomeScreen } from "screens/home";
import { InfoScreen } from "screens/info";
import { ImageScreen } from "screens/images";
import { BudgetScreen } from "screens/budgets";
import { Venue } from "@store/venue/venueSlice";
import { useDispatch, useSelector } from "react-redux";
import { CalendarioMainScreen } from "screens/calendar";
import { AppDispatch, RootState } from "@store/index";
import { fecthOwnersByVenue } from "@store/owner/ownerSlice";
import { fecthServices } from "@store/service/service-slice";
import { createStackNavigator } from "@react-navigation/stack";
import { Organization } from "@store/organization/organizationSlice";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PersonListScreen from "screens/budgets/screens/proposal/components/modal/person";
import PagamentoScreen from "screens/budgets/screens/proposal/components/modal/pagamento";
import { ProposaInfoScreen } from "screens/budgets/screens/proposal/components/modal/info";
import AgendamentoScreen from "screens/budgets/screens/proposal/components/modal/date-event";
import ScheduleProposalScreen from "screens/budgets/screens/proposal/components/modal/schedule-proposal";
import {
  AntDesign,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";
import { AnalisisScreen } from "screens/analisy";
import DocumentScreen from "screens/budgets/screens/proposal/components/modal/document";
import { SafeAreaView } from "react-native-safe-area-context";
import { User } from "@store/auth/authSlice";
import { StyledView } from "styledComponents";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const screens = [
  { name: "Home", component: HomeScreen, permission: "VIEW_NOTIFICATIONS"},
  { name: "Imagens", component: ImageScreen, permission: "VIEW_IMAGES"},
  { name: "Info", component: InfoScreen, permission: "VIEW_INFO"},
  { name: "Orcam", component: BudgetScreen, permission: "VIEW_PROPOSALS"},
  { name: "Analise", component: AnalisisScreen, permission: "VIEW_ANALYSIS"},
  { name: "Agenda", component: CalendarioMainScreen, permission: "VIEW_CALENDAR"},
];

function TabNavigator() {

  const venue = useSelector(
    (state: RootState) => state.venueList.venue
  );

  const authorizedScreens = screens.filter(screen => 
    venue?.permissions?.includes(screen.permission)
  );

  // Define a rota inicial dinamicamente
  const initialRoute = authorizedScreens?.find(s => s.name === "Home")?.name || authorizedScreens[0]?.name;

  if (!venue || !venue.permissions) {
    return null; // Retorna null se não houver permissões, evitando erro
  }

  if (authorizedScreens.length === 0) {
    return null; // Evita erro se nenhuma tela for autorizada
  }

  return (
    <Tab.Navigator
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1E1F22",
          height: 70
        },
        tabBarLabelStyle: { fontSize: 13, fontWeight: "500" },
        tabBarActiveTintColor: "rgb(250, 235, 215)",
        tabBarInactiveTintColor: "rgb(156 163 175)",
      }}
    >
     {authorizedScreens
        .filter(screen => venue.permissions?.includes(screen.permission))
        .map(({ name, component }) => (
          <Tab.Screen
            key={name}
            name={name}
            component={component}
            options={{
              tabBarIcon: ({ color }) => {
                const icons: Record<string, JSX.Element> = {
                  Imagens: <Octicons name="image" size={18} color={color} />,
                  Info: <Ionicons name="information-sharp" size={25} color={color} />,
                  Orcam: <MaterialIcons name="attach-money" size={22} color={color} />,
                  Analise: <FontAwesome name="bar-chart-o" size={20} color={color} />,
                  Home: <MaterialCommunityIcons name="home-outline" size={25} color={color} />,
                  Agenda: <AntDesign name="calendar" size={20} color={color} />,
                };
                return icons[name] || null;
              },
            }}
          />
        ))}
    </Tab.Navigator>
  );
}

export default function SelectedVenueScreen() {
  const venue: Venue = useSelector(
    (state: RootState) => state?.venueList.venue
  );
  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );

  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams();

  useEffect(() => {
    queryParams.append("venueId", venue?.id);
    dispatch(fecthServices(`${queryParams.toString()}`));
    dispatch(
      fecthOwnersByVenue({
        organizationId: organization?.id,
        venueId: venue?.id,
      })
    );
  }, [venue]);

  return (
    <StyledView className="h-full w-full">
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen name="PagamentoScreen" component={PagamentoScreen} />
        <Stack.Screen name="PersonListScreen" component={PersonListScreen} />
        <Stack.Screen name="ProposaInfoScreen" component={ProposaInfoScreen} />
        <Stack.Screen name="AgendamentoScreen" component={AgendamentoScreen} />
        <Stack.Screen
          name="ScheduleScreen"
          component={ScheduleProposalScreen}
        />
        <Stack.Screen name="DocumentScreen" component={DocumentScreen} />
      </Stack.Navigator>
    </StyledView>
  );
}
