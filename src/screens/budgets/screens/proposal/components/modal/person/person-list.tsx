import { ProposalType } from "type";
import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { EvilIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { Person } from "@store/person/person-slice";
import { PersonItemList } from "./person-item-list";
import { ListEmpty } from "@components/list/ListEmpty";
import { FlatList } from "react-native-gesture-handler";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { StyledText, StyledTextInput, StyledView } from "styledComponents";

export const StyledFlatList = styled(FlatList<Person>);

interface PersonListProps{
  personType: "GUEST" | "WORKER"
}

export function PersonList({personType}:PersonListProps) {
  const [query, setQuery] = useState<string>("");

  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );

  const loading : boolean = useSelector(
    (state: RootState) => state.proposalList.loading
  );
  const renderItem = useCallback(
    ({ item }: { item: Person }) => {
      return <PersonItemList person={item} />;
    },
    [] 
  );

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
    <StyledView>
      <StyledView className="w-full">
        <StyledView className="w-full py-2 px-2 flex justify-start items-center  rounded-md bg-white flex-row my-3">
          <EvilIcons name="search" size={24} color="black" />
          <StyledTextInput
            onChangeText={(value) => setQuery(value)}
            value={query}
            placeholder={`Filtrar...`}
            className="text-sm text-text-gray  outline-none  flex-1 mt-[7px]"
          />
        </StyledView>
      </StyledView>
      <>
      <StyledFlatList
        windowSize={5}
        className="flex-1"
        initialNumToRender={4}
        renderItem={renderItem}
        maxToRenderPerBatch={10}
        data={proposal.personList.filter((item: Person) => item.name.includes(query) && item.type === personType )}
        removeClippedSubviews={false}
        keyExtractor={(item: Person) => item?.id} // Garante que a chave é única
        ItemSeparatorComponent={renderItemSeparator}
        ListEmptyComponent={renderListEmptyComponent}
      />
    </>
    </StyledView>
  );
}
