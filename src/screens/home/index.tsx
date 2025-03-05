import { StyledView } from "styledComponents";
import { useCallback, useEffect } from "react";
import { Venue } from "@store/venue/venueSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { useFocusEffect } from "@react-navigation/native";
import ListNotifications from "./notifications/listNotifications";
import { fetchNotificationsList } from "@store/notifications/notificationsSlice";

export function HomeScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const queryParams = new URLSearchParams();
  const venue : Venue = useSelector(
    (state: RootState) => state?.venueList.venue
  );

  useFocusEffect(
    useCallback(() => {
      if (venue?.id) {
        dispatch(fetchNotificationsList(venue.id));
      }
    }, [venue])  // Garante que o hook vai disparar quando o "venue" mudar
  );

  return (
    <StyledView className="bg-gray-dark flex flex-col h-full w-full">
      <ListNotifications />
    </StyledView>
  );
}
