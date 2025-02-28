import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { DocumentType, ProposalType } from "type";
import { ListEmpty } from "@components/list/ListEmpty";
import { DocumentItemFlatList } from "./item-flat-list";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<DocumentType>);

export function DocumentFlatList() {
  
  const loading : boolean = useSelector((state: RootState) => state.proposalList.loading);
  const documents : DocumentType[] = useSelector((state: RootState) => state.documentList.documents);

  if (loading) {
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
        keyExtractor={(item: DocumentType) => item.id}
        data={documents}
        renderItem={({ item }: { item: DocumentType }) => {
          return <DocumentItemFlatList document={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="documento" />}
        className="flex-1"
      />
    </>
  );
}
