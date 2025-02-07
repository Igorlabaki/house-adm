import { View, Text } from "react-native";
import React, { useEffect } from "react";
import { StyledPressable, StyledText } from "styledComponents";
import {
  Organization,
  selectOrganizationAsync,
} from "@store/organization/organizationSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { useNavigation } from "@react-navigation/native";
import { removeUserSave } from "storage/storage-user";

interface OrganizationItemListProps {
  organization: Organization;
}

export default function OrganizationItemList({
  organization,
}: OrganizationItemListProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();
  const queryParams = new URLSearchParams();

  queryParams.append("organizationId", organization?.id);

  return (
    <StyledPressable
      onPress={() => {
        dispatch(selectOrganizationAsync({ url: `${queryParams.toString()}` }));
        navigation.navigate("SelectedOrganization");
      }}
      className="
        flex flex-col items-start justify-center 
        px-5 bg-[#313338] rounded-md py-5
        overflow-hidden shadow-lg relative w-full"
      key={organization.id}
    >
      <StyledText className="text-custom-white text-md">
        {organization.name}
      </StyledText>
    </StyledPressable>
  );
}
