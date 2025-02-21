
import { ContactType } from "type";
import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import ContactItemFlatList from "./Item-flat-list";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<ContactType>);

export function ContactFlatList() {
  const contactList = useSelector((state: RootState) => state.contactList);

  if (contactList.loading) {
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
        keyExtractor={(item: ContactType) => item.id}
        data={contactList?.contacts}
        renderItem={({
          item,
          index,
        }: {
          item: ContactType;
          index: number;
        }) => {
          return (
            <ContactItemFlatList
              contact={item}
              key={item.id}
              index={index + 1}
            />
          );
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="contato" />}
        className="flex-1"
      />
    </>
  );
}
