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
      onPress={async () => {
        await dispatch(selectOrganizationAsync(`${queryParams.toString()}`))
        navigation.navigate("SelectedOrganization");
      }}
      className="
        flex flex-col items-start justify-center 
        px-5 bg-white border-[1px] border-l-[3px] border-l-eventhub-primary border-y-gray-200 border-r-gray-200 shadow-lg rounded-md py-5
        overflow-hidden  relative w-full" 
      key={organization?.id}
    >
      <StyledText className="font-bold  text-gray-600 text-md">
        {organization?.name}
      </StyledText>
    </StyledPressable>
  );
}
