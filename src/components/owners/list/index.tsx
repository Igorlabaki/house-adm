import { OwnerType } from "type";
import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { ListEmpty } from "@components/list/ListEmpty";
import { OwnerItemListComponent } from "./ownerItemList";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

interface OwnerListProps {
  isLoading: boolean;
  owners: OwnerType[];
}
export const StyledFlatList = styled(FlatList<OwnerType>);

export function OwnerListComponent({ isLoading,owners }: OwnerListProps) {

  if (isLoading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView  className="h-full w-full flex">
      <StyledFlatList
        className="flex-1 w-full  mb-20"
        keyExtractor={(item: OwnerType) => item.id}
        data={owners}
        renderItem={({ item }: { item: OwnerType }) => {
          return <OwnerItemListComponent owner={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="Proprietario" />}
        windowSize={5}
        maxToRenderPerBatch={10}
        initialNumToRender={4}
      />
    </StyledView>
  );
}
