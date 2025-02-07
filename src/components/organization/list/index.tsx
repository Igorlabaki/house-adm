import React from "react";
import { styled } from "nativewind";
import { ListEmpty } from "@components/list/ListEmpty";
import OrganizationItemList from "./organizationItemList";
import { ActivityIndicator, FlatList } from "react-native";
import { Organization } from "@store/organization/organizationSlice";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { StyledScrollView, StyledText, StyledView } from "styledComponents";

export const StyledFlatList = styled(FlatList<Organization>);

interface OrganizationFlatListProps {
    isLoading: boolean;
    organizationList: Organization[];
}

export const OrganizationFlatList = React.memo(({isLoading,organizationList}:OrganizationFlatListProps) => {
 
  if (isLoading) {
    return (
      <StyledView className="w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="w-full h-screen">
      <StyledFlatList
        className="flex-1 w-full  mb-20"
        keyExtractor={(item: Organization) => item.id}
        data={organizationList}
        renderItem={({ item }: { item: Organization }) => {
          return <OrganizationItemList organization={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="organizacao" />}
        windowSize={5}
        maxToRenderPerBatch={10}
        initialNumToRender={4}
      />
    </StyledView>
  );
});

