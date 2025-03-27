import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { StyledView } from "styledComponents";
import { Organization } from "@store/organization/organizationSlice";
import { VenueFlatList } from "../../../components/venue/venuesList";

export function VenueListScreen() {
  const { loading }: { loading: boolean; organization: Organization } =
    useSelector((state: RootState) => state.organizationList);

  const venues = useSelector(
    (state: RootState) => state.venueList.venues
  );
  
  return (
    <StyledView className="h-full w-full bg-gray-dark py-5">
      <StyledView className="flex flex-col justify-center items-center gap-y-4 mt-4">
        <VenueFlatList isLoading={loading} venueList={venues} />
      </StyledView>
    </StyledView>
  );
}
