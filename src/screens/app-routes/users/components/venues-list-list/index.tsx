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
import { Organization } from "@store/organization/organizationSlice";
import { VenueListItemList } from "./venue-list-item-list";
import { User } from "@store/auth/authSlice";

interface VenueListParams {
  userOrganization?: UserOrganizationType;
  setFormSection: React.Dispatch<
    React.SetStateAction<"USER" | "VENUE" | "NEW_USER">
  >;
}

type VenueListItem = {
  id: string;
  name: string;
  userPermission ?: UserPermissionType;
}

export const StyledFlatList = styled(FlatList<Venue>);

export const VenueListFlatList = React.memo(
  ({ userOrganization, setFormSection }: VenueListParams) => {
   
    const venues : Venue[] = useSelector(
      (state: RootState) => state.venueList.venues
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

    return (
      <StyledFlatList
        className="flex-1 w-full"
        keyExtractor={(item: Venue) => item.id}
        data={venues}
        renderItem={({ item }: { item: Venue }) => (
          <VenueListItemList
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
