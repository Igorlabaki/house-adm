import React from "react";
import { styled } from "nativewind";
import { Venue } from "@store/venue/venueSlice";
import { ListEmpty } from "@components/list/ListEmpty";
import { VenueItemList } from "./venueItemList";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { StyledText, StyledView } from "styledComponents";

export const StyledFlatList = styled(FlatList<Venue>);

interface VenueFlatListProps {
  isLoading: boolean;
  venueList: Venue[];
}

export const VenueFlatList = React.memo(
  ({ isLoading, venueList }: VenueFlatListProps) => {
    if (isLoading) {
      return (
        <StyledView className="h-full w-full flex justify-center items-center">
          <ActivityIndicator size="large" color="white" />
          <StyledText className="text-white">Loading</StyledText>
        </StyledView>
      );
    }
    return (
      <StyledView className="w-full h-[100%]">
        <StyledFlatList
          className="flex-1 w-full  mb-20"
          keyExtractor={(item: Venue) => item.id}
          data={venueList}
          renderItem={({ item }: { item: Venue }) => {
            return <VenueItemList venue={item} key={item.id} />;
          }}
          ItemSeparatorComponent={() => <ItemSeparatorList />}
          ListEmptyComponent={() => <ListEmpty dataType="Locacao" />}
          windowSize={5}
          maxToRenderPerBatch={10}
          initialNumToRender={4}
        />
      </StyledView>
    );
  }
);
