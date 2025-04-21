import { styled } from "nativewind";
import { useCallback } from "react";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { ActivityIndicator } from "react-native";
import { WorkerItemList } from "./worker-item-list";
import { WorkerType } from "@store/worker/worker-slice";
import { ListEmpty } from "@components/list/ListEmpty";
import { FlatList } from "react-native-gesture-handler";
import { StyledText, StyledView } from "styledComponents";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<WorkerType>);

export function WorkerList() {
  const loading: boolean = useSelector(
    (state: RootState) => state.proposalList.loading
  );
  const workerList: WorkerType[] = useSelector(
    (state: RootState) => state.workerState.workerList
  );
  const renderItem = useCallback(({ item }: { item: WorkerType }) => {
    return <WorkerItemList worker={item} />;
  }, []);

  // Memoize the ItemSeparatorComponent
  const renderItemSeparator = useCallback(() => {
    return <ItemSeparatorList />;
  }, []);

  // Memoize the ListEmptyComponent
  const renderListEmptyComponent = useCallback(() => {
    return <ListEmpty dataType="convidados" />;
  }, []);

  if (loading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="w-full flex-1">
      <StyledView className="flex flex-row justify-between items-center pb-3">
        <StyledView className="flex flex-row justify-start items-center gap-x-2">
          <StyledText className="text-custom-white font-bold">
            Colaboradores :
          </StyledText>
          <StyledText className="text-custom-white font-light">
            {`${workerList?.length}`}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-row  justify-start items-center gap-x-2">
          <StyledText className="text-custom-white font-bold">
            Presentes :
          </StyledText>
          <StyledText className="text-custom-white font-light">
            {`${
              workerList?.filter((item: WorkerType) => item.attendance === true)
                .length
            }`}
          </StyledText>
        </StyledView>
      </StyledView>
      <StyledFlatList
        windowSize={5}
        className="flex-1"
        initialNumToRender={4}
        renderItem={renderItem}
        maxToRenderPerBatch={10}
        data={workerList}
        removeClippedSubviews={false}
        keyExtractor={(item: WorkerType) => item?.id} // Garante que a chave é única
        ItemSeparatorComponent={renderItemSeparator}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </StyledView>
  );
}
