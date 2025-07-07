import { StyledPressable, StyledText } from "styledComponents";
import {
  Venue,
  selectVenueAsync,
} from "@store/venue/venueSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { useNavigation } from "@react-navigation/native";
import { User } from "@store/auth/authSlice";

interface VenueItemListProps {
  venue: Venue;
}

export function VenueItemList({
  venue,
}: VenueItemListProps) {
  const navigation = useNavigation();
  const queryParams = new URLSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const user: User = useSelector(
    (state: RootState) => state.session.user
  );
  queryParams.append("venueId", venue?.id);
  queryParams.append("userId", user?.id);

  return (
    <StyledPressable
      onPress={async () => {
        await dispatch(selectVenueAsync(`${queryParams.toString()}`));
        navigation.navigate("SelectedVenue");
      }}
      className=" flex flex-col items-start justify-center 
        px-5 bg-white border-[1px] border-l-[3px] border-l-eventhub-primary border-y-gray-200 border-r-gray-200 shadow-lg rounded-md py-5
        overflow-hidden  relative w-full" 
      key={venue.id}
    >
      <StyledText className="font-bold  text-gray-600 text-md">
        {venue.name}
      </StyledText>
    </StyledPressable>
  );
}
