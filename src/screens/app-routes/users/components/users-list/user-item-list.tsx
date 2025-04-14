import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { useState } from "react";
import { Organization } from "@store/organization/organizationSlice";
import { User } from "@store/auth/authSlice";
import { selectedUser } from "@store/userList/user-list-slice";


interface UserItemListProps {
  item: User;
  setUser: React.Dispatch<React.SetStateAction<User>>
  setFormSection: React.Dispatch<React.SetStateAction<"USER" | "VENUE" | "NEW_USER" | "NEW_VENUE">>
}

export function UserItemList({
  item,
  setUser,
  setFormSection,
}: UserItemListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const handlePress = async () => {
    const queryParams = new URLSearchParams();
    queryParams.append("userId", item.id)
    const user = await dispatch(selectedUser(`${queryParams.toString()}`))
    setUser(user.payload.data)
    setFormSection("NEW_VENUE") // Navega para a seção de permissões
  };

  return (
    <StyledPressable
      onPress={() => handlePress()}
      className={`flex flex-row items-center justify-between px-5 py-5 bg-[#313338] rounded-md overflow-hidden shadow-lg relative w-full 
      `}
      key={item?.id}
    >
      <StyledText className="text-custom-white text-md font-bold">
        {item.username}
      </StyledText>
    </StyledPressable>
  );
}

/* 
 */
