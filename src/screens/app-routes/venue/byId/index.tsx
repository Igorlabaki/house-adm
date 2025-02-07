import React, { useEffect } from 'react'
import { HomeScreen } from 'screens/home';
import { InfoScreen } from 'screens/info';
import { ImageScreen } from 'screens/images';
import { BudgetScreen } from 'screens/budgets';
import { Venue } from '@store/venue/venueSlice';
import { useDispatch, useSelector } from 'react-redux';
import { CalendarioMainScreen } from 'screens/calendar';
import { AppDispatch, RootState } from '@store/index';
import { fecthOwnersByVenue } from '@store/owner/ownerSlice';
import { fecthServices } from '@store/service/service-slice';
import { createStackNavigator } from '@react-navigation/stack';
import { Organization } from '@store/organization/organizationSlice';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PersonListScreen from 'screens/budgets/screens/proposal/components/modal/person';
import PagamentoScreen from 'screens/budgets/screens/proposal/components/modal/pagamento';
import { ProposaInfoScreen } from 'screens/budgets/screens/proposal/components/modal/info';
import AgendamentoScreen from 'screens/budgets/screens/proposal/components/modal/date-event';
import ScheduleProposalScreen from 'screens/budgets/screens/proposal/components/modal/schedule-proposal';
import { AntDesign, FontAwesome, Ionicons, MaterialCommunityIcons, MaterialIcons, Octicons } from '@expo/vector-icons';
import { AnalisisScreen } from 'screens/analisy';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1E1F22", height: 70, paddingTop: 10, paddingBottom: 10 },
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
            <MaterialCommunityIcons name="home-outline" size={25} color={color} />
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
        name="Orcam"
        component={BudgetScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="attach-money" size={22} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Analise"
        component={AnalisisScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="bar-chart-o" size={20} color={color} />
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

export default function SelectedVenueScreen() {
  const venue: Venue = useSelector((state: RootState) => state?.venueList.venue);
  const organization: Organization = useSelector((state: RootState) => state.organizationList.organization);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fecthServices(venue?.id));
    dispatch(fecthOwnersByVenue({ organizationId: organization?.id, venueId: venue?.id }));
  }, [venue]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="PagamentoScreen" component={PagamentoScreen} />
      <Stack.Screen name="PersonListScreen" component={PersonListScreen} />
      <Stack.Screen name="ProposaInfoScreen" component={ProposaInfoScreen} />
      <Stack.Screen name="AgendamentoScreen" component={AgendamentoScreen} />
      <Stack.Screen name="ScheduleScreen" component={ScheduleProposalScreen} />
    </Stack.Navigator>
  );
}