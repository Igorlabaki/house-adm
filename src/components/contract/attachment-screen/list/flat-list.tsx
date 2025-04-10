import { AttachmentType } from "type";
import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import AttachmentItemFlatList from "./item-flat-list";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<AttachmentType>);

export function AttachmentFlatList() {
  const attachmentList = useSelector((state: RootState) => state.attachmentState);

  if (attachmentList.loading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <>
      <StyledFlatList
        removeClippedSubviews={false}
        keyExtractor={(item: AttachmentType) => item.id}
        data={attachmentList?.attachments}
        renderItem={({
          item,
          index,
        }: {
          item: AttachmentType;
          index: number;
        }) => {
          return (
            <AttachmentItemFlatList
              attachment={item}
              key={item.id}
              index={index + 1}
            />
          );
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="clausula" />}
        className="flex-1"
      />
    </>
  );
}
