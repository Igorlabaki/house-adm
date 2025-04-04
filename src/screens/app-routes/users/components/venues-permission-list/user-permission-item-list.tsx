import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { UserOrganizationType, UserPermissionType } from "type";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { selectUserPermissionAsync } from "@store/user-permission/user-permission-slice";
import { useState } from "react";
import { Organization } from "@store/organization/organizationSlice";
import UserOrganizationFormUpdateModalComponent from "../form/update";
import UserOrganizationFormCreateModalComponent from "../form/create";

interface VenueItemListProps {
  userorganization?: UserOrganizationType;
  item: {id: string, name: string , userPermission : UserPermissionType};
  setFormSection: React.Dispatch<
    React.SetStateAction<"USER" | "VENUE" | "NEW_USER" | "NEW_VENUE">
  >;
}

export function UserPermissionItemList({
  item,
  setFormSection
}: VenueItemListProps) {
  const dispatch = useDispatch<AppDispatch>();
   const userOrganization: UserOrganizationType = useSelector(
      (state: RootState) => state.userOrganizationList.userOrganization
    );
  const queryParams = new URLSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handlePress = async () => {
    if(item?.userPermission?.id){
      queryParams.append("userPermissionId", item.userPermission.id);
      await dispatch(selectUserPermissionAsync(`${queryParams.toString()}`));
    }
    setIsModalOpen(true); // Navega para a seção de permissões
  };

  return (
    <StyledPressable
      onPress={() => handlePress()}
      className={`flex flex-row items-center justify-between px-5 py-5 bg-[#313338] rounded-md overflow-hidden shadow-lg relative w-full 
        ${
            item.userPermission
            ? "bg-green-800"
            : ""
        }
      `}
      key={item?.id}
    >
      <StyledText className="text-custom-white text-md font-bold">
        {item?.name}
      </StyledText>
      <StyledView className="flex-row justify-start items-start gap-x-2">
        <StyledText className="text-[12px] text-custom-white font-semibold">
          {item?.userPermission?.role}
        </StyledText>
      </StyledView>
      {isModalOpen && item.userPermission && (
        <UserOrganizationFormUpdateModalComponent
          isModalOpen={isModalOpen}
          setFormSection={setFormSection}
          userPermission={item.userPermission}
          setMenuModalIsOpen={setIsModalOpen}
        />
      )}
      {isModalOpen && !item.userPermission && (
        <UserOrganizationFormCreateModalComponent
          isModalOpen={isModalOpen}
          venueId={item.id}
          setMenuModalIsOpen={setIsModalOpen}
          setFormSection={setFormSection}
        />
      )}
    </StyledPressable>
  );
}

/* 
 */
