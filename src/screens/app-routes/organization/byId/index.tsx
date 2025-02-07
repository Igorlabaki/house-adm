import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { VenueListScreen } from "screens/app-routes/venue";
import { fecthOwnersByOrganization } from "@store/owner/ownerSlice";
import { Organization } from "@store/organization/organizationSlice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { VenueFormModalComponent } from "../../../../components/venue/form";
import { OwnerType } from "type";

export  function SelectedOrganizationScreen() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );

  useEffect(() => {
    dispatch(fecthOwnersByOrganization(organization?.id))
  }, [organization.id]);
    
  return (
    <StyledView className="h-full w-full bg-gray-dark py-5 relative">
      <StyledPressable
        onPress={() => setIsModalOpen(true)}
        className="
          justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
          rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-2 border-[0.6px] border-white border-solid w-[50%]"
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Nova Locacao
        </StyledText>
      </StyledPressable>
      <VenueListScreen />
      {isModalOpen && (
        <VenueFormModalComponent
          isModalOpen={isModalOpen}
          setMenuModalIsOpen={setIsModalOpen}
        />
      )}
    </StyledView>
  );
}
