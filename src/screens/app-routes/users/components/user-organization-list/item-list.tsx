import { useEffect, useState } from "react";
import { Image } from "react-native";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { UserOrganizationType } from "type";
import { FontAwesome5 } from "@expo/vector-icons";

import { Organization, selectOrganizationAsync } from "@store/organization/organizationSlice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { selectUserOrganizationAsync } from "@store/userOrganization/user-organization--slice";
import UserOrganizationFormUpdateModalComponent from "../form/update";

interface UserOrganizationItemListProps {
  userorganization: UserOrganizationType;
  setFormSection: React.Dispatch<React.SetStateAction<"USER" | "VENUE" | "NEW_USER">>
}

export function UserOrganizationItemListComponent({
  setFormSection,
  userorganization,
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
        await  dispatch(selectUserOrganizationAsync(`${queryParams.toString()}`))
        setFormSection("VENUE")
      }}
      className="flex flex-col items-start  justify-center px-5 py-5 bg-[#313338] w-full rounded-md overflow-hidden shadow-lg relative"
    >
      <StyledView className=" flex flex-row gap-y-2 gap-x-3  items-center justify-between  overflow-hidden overflow-y-auto w-full">
        <StyledView className="flex flex-row justify-start items-center gap-x-1">
          {userorganization.user?.avatarUrl ? (
            <StyledPressable className="h-5 w-5 rounded-full bg-transparent overflow-hidden ">
              <Image
                source={{ uri: userorganization.user?.avatarUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </StyledPressable>
          ) : (
            <StyledPressable className="mr-2">
              <FontAwesome5 name="user-circle" size={27} color="white" />
            </StyledPressable>
          )}
          <StyledView className="flex-row justify-start items-start gap-x-2">
            <StyledText className="text-[12px] text-white font-semibold">
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
