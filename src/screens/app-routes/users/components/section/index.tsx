import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";
import { StyledText, StyledView } from "styledComponents";

import { fecthUserPermission } from "@store/user-permission/user-permission-slice";
import { UserOrganizationType } from "type";
import { User } from "@store/auth/authSlice";
import { VenuePermissionFlatList } from "../venues-permission-list";

interface VenueSectionProps{
  userSelected?: User;
  userOganization?: UserOrganizationType;
  setFormSection: React.Dispatch<React.SetStateAction<"USER" | "VENUE" | "NEW_USER"| "NEW_VENUE">>
}

export default function VenueSection({userOganization,userSelected,setFormSection}:VenueSectionProps) {
  const queryParams = new URLSearchParams();
  return (
    <StyledView className="flex flex-col gap-y-1 h-screen relative">
      <StyledText className="text-custom-gray text-[14px] font-semibold mb-4">
        Selecione a Propriedade:
      </StyledText>
      <SearchFilterListByQueryComponent
        queryName="name"
        queryParams={queryParams}
        fectData={fecthUserPermission}
        entityId={userOganization?.id || ""}
        entityName="userOrganizationId"
      />
      <StyledView className="flex-1 max-h-64">
        <VenuePermissionFlatList setFormSection={setFormSection} />
      </StyledView>
      <StyledView />
    </StyledView>
  );
}
