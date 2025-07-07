import { useEffect, useState } from "react";
import { Image } from "react-native";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { UserOrganizationType, UserPermissionType } from "type";
import { FontAwesome5 } from "@expo/vector-icons";

import { Organization, selectOrganizationAsync } from "@store/organization/organizationSlice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { selectUserOrganizationAsync } from "@store/userOrganization/user-organization--slice";
import UserOrganizationFormUpdateModalComponent from "../form/update";
import { User } from "@store/auth/authSlice";
import { setUser } from "@store/user/userSlice";

interface UserOrganizationItemListProps {
  setUser: React.Dispatch<React.SetStateAction<User>>
  userorganization: UserOrganizationType;
  setFormSection: React.Dispatch<React.SetStateAction<"USER" | "VENUE" | "NEW_USER">>
}

export function UserOrganizationItemListComponent({
  setFormSection,
  userorganization,
  setUser,
}: UserOrganizationItemListProps) {
    const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryParams = new URLSearchParams();
  
  useEffect(() => {
    if(!queryParams.has("userOrganizationId")){
      queryParams.append("userOrganizationId", userorganization?.id);
    }
  }, [])
    
  return (
    <StyledPressable
      onPress={async () => {
        const userOrganization = await  dispatch(selectUserOrganizationAsync(`${queryParams.toString()}`))
        setUser(userOrganization?.payload?.data?.user)
        setFormSection("VENUE")
      }}
      className=" flex flex-col items-start justify-center 
      px-5 bg-white border-[1px] border-l-[3px] border-l-eventhub-primary border-y-gray-200 border-r-gray-200 shadow-lg rounded-md py-5
      overflow-hidden  relative w-full" 
    >
      <StyledView className=" flex flex-row gap-y-2 gap-x-3  items-center justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex flex-row justify-start items-center gap-x-1">
          {userorganization.user?.avatarUrl ? (
            <StyledPressable className="h-8 w-8 rounded-full bg-transparent overflow-hidden ">
              <Image
                source={{ uri: userorganization.user?.avatarUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </StyledPressable>
          ) : (
            <StyledPressable className="mr-2">
              <FontAwesome5 name="user-circle" size={27} color="#4b5563" />
            </StyledPressable>
          )}
          <StyledView className="flex-row justify-start items-start gap-x-2">
            <StyledText className="text-[12px] text-gray-600  font-semibold">
              {userorganization?.user?.username}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
      <UserOrganizationFormUpdateModalComponent
        setFormSection={setFormSection}
        isModalOpen={isModalOpen}
        setMenuModalIsOpen={setIsModalOpen}
      />
    </StyledPressable>
  );
}
