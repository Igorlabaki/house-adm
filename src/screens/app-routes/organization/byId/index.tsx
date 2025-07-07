import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { VenueListScreen } from "screens/app-routes/venue";
import { fecthOwnersByOrganization } from "@store/owner/ownerSlice";
import { Organization } from "@store/organization/organizationSlice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { VenueFormModalComponent } from "../../../../components/venue/form";
import { SearchFilterListByQueriesComponent } from "@components/list/searchFilterListByQueries";
import { fecthVenues, Venue } from "@store/venue/venueSlice";
import { User } from "@store/auth/authSlice";
import { VenueFlatList } from "@components/venue/venuesList";

export function SelectedOrganizationScreen() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );
  const user: User = useSelector((state: RootState) => state.session.user);
  const { venues, loading }: { venues: Venue[]; loading: boolean } =
    useSelector((state: RootState) => state.venueList);

  const queryParams = new URLSearchParams();
  
  useEffect(() => {
    const fetchData = async () => {
      if (organization?.id) {
        const queryParams = new URLSearchParams();
        queryParams.append("organizationId", organization.id);
        await dispatch(fecthOwnersByOrganization(queryParams.toString()));
      }
    };
  
    fetchData();
  }, [organization?.id, dispatch]);

  return (
    <StyledView className="h-full w-full bg-eventhub-background py-5 relative px-1">
      <StyledPressable
        onPress={() => setIsModalOpen(true)}
        className="
          justify-center items-center bg-eventhub-primary active:scale-95
          rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-2 w-[50%] border-[0.6px] border-white border-solid"
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Nova Locacao
        </StyledText>
      </StyledPressable>
      <SearchFilterListByQueriesComponent
        queryName="name"
        fectData={fecthVenues}
        queryParams={queryParams}
        entityQueries={[
          { name: "organizationId", value: organization?.id },
          { name: "userId", value: user.id },
        ]}
      />
      <VenueFlatList isLoading={loading} venueList={venues} />
      {isModalOpen && (
        <VenueFormModalComponent
          isModalOpen={isModalOpen}
          setMenuModalIsOpen={setIsModalOpen}
        />
      )}
    </StyledView>
  );
}
