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
  console.log(item?.userPermission?.role)
  return (
    <StyledPressable
      onPress={() => handlePress()}
      className=" flex flex-row justify-between items-center 
      px-5 bg-white border-[1px] border-l-[3px] border-l-eventhub-primary border-y-gray-200 border-r-gray-200 shadow-lg rounded-md py-5
      overflow-hidden  relative w-full"
      key={item?.id}
    >
      <StyledText className="text-gray-600 text-md font-bold">
        {item?.name}
      </StyledText>
      <StyledView className="flex-row justify-start items-start gap-x-2">
        <StyledText className={`${item?.userPermission?.role === "ADMIN" ? "text-green-800 bg-green-100" : "text-blue-800 bg-blue-100"} p-1 rounded-md  text-[12px]  font-semibold`}>
          {item?.userPermission?.role
            ? item.userPermission.role.charAt(0).toUpperCase() + item.userPermission.role.slice(1).toLowerCase()
            : ""}
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
