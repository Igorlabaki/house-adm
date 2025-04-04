import React, { useEffect } from "react";
import { styled } from "nativewind";
import { Venue } from "@store/venue/venueSlice";
import { ListEmpty } from "@components/list/ListEmpty";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { StyledText, StyledView } from "styledComponents";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { UserOrganizationType, UserPermissionType } from "type";
import { UserPermissionItemList } from "./user-permission-item-list";
import { Organization } from "@store/organization/organizationSlice";

interface VenuePermissionParams {
  userOrganization?: UserOrganizationType;
  setFormSection: React.Dispatch<
    React.SetStateAction<"USER" | "VENUE" | "NEW_USER">
  >;
}

type VenuePermissionItem = {
  id: string;
  name: string;
  userPermission : UserPermissionType;
}

export const StyledFlatList = styled(FlatList<VenuePermissionItem>);

export const VenuePermissionFlatList = React.memo(
  ({ userOrganization, setFormSection }: VenuePermissionParams) => {
   
    const userPermissions: UserPermissionType[] = useSelector(
      (state: RootState) => state.userPermittionState.userPermissions
    );

    const organization: Organization = useSelector(
      (state: RootState) => state.organizationList.organization
    );

    const isLoading = useSelector(
      (state: RootState) => state.venueList.loading
    );

    if (isLoading) {
      return (
        <StyledView className="w-full flex justify-center items-center">
          <ActivityIndicator size="large" color="white" />
          <StyledText className="text-white">Loading</StyledText>
        </StyledView>
      );
    }

    function mergeVenuesWithPermissions(venues, userPermissions=[]) : VenuePermissionItem[] {
      return venues?.map(venue => {
        const userPermission = userPermissions && userPermissions?.find(up => up.venueId === venue.id) || null;
        return { ...venue, userPermission };
      });
    }
   
    return (
      <StyledFlatList
        className="flex-1"
        keyExtractor={(item: VenuePermissionItem) => item.id}
        data={mergeVenuesWithPermissions(organization.venues,userPermissions)}
        renderItem={({ item }: { item: VenuePermissionItem }) => (
          <UserPermissionItemList
            item={item}
            setFormSection={setFormSection}
            userorganization={userOrganization}
          />
        )}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="Locacao" />}
        windowSize={5}
        maxToRenderPerBatch={10}
        initialNumToRender={4}
      />
    );
  }
);
