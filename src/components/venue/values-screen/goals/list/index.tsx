import { GoalType } from "type";
import { styled } from "nativewind";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { GoalItemFlatList } from "./item-list";

export const StyledFlatList = styled(FlatList<GoalType>);

export function GoalFlatList() {
  const { loading, goals } = useSelector(
    (state: RootState) => state.goalState
  );

  if (loading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="goal-white">Loading</StyledText>
      </StyledView>
    );
  }
 
  return (
    <>      
      <StyledFlatList
        removeClippedSubviews={false}
        keyExtractor={(item: GoalType) => item.id}
        data={goals}
        renderItem={({ item }: { item: GoalType }) => {
          return <GoalItemFlatList goal={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="meta" />}
        className="flex-1"
      />
    </>
  );
}
