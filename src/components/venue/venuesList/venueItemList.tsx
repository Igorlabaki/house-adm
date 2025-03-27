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
      className="flex flex-col items-start justify-start px-5 py-5 bg-[#313338] rounded-md overflow-hidden shadow-lg relative w-full "
      key={venue.id}
    >
      <StyledText className="text-custom-white text-md">
        {venue.name}
      </StyledText>
    </StyledPressable>
  );
}
