import { StyledView } from "styledComponents";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import {
  Organization,
  selectOrganizationAsync,
} from "@store/organization/organizationSlice";
import { VenueFlatList } from "../../../components/venue/venuesList";

export  function VenueListScreen() {
 
  const {
    loading,
    organization,
  }: { loading: boolean; organization: Organization } = useSelector(
    (state: RootState) => state.organizationList
  );

  const queryParams = new URLSearchParams();

  return (
    <StyledView className="h-full w-full bg-gray-dark py-5">
      <StyledView className="flex flex-col justify-center items-center gap-y-4 mt-4">
        <SearchFilterListByQueryComponent
          entity="venueName"
          fectData={selectOrganizationAsync}
          queryParams={queryParams}
        />
        <VenueFlatList
          isLoading={loading}
          venueList={organization.venues}
        />
      </StyledView>

    </StyledView>
  );
}
