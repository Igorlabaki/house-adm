import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { UserOrganizationType } from "type";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { UserOrganizationItemListComponent } from "./item-list";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";

export const StyledFlatList = styled(FlatList<UserOrganizationType>);

interface UserPermissionProps{
  setFormSection: React.Dispatch<React.SetStateAction<"USER" | "VENUE">>
}

export function UserOrganizationFlatList({setFormSection}: UserPermissionProps) {

  const {userOrganizationsByOrganization,loading} = useSelector((state: RootState) => state.userOrganizationList);

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
        removeClippedSubviews={false}
        keyExtractor={(item: UserOrganizationType) => item.id}
        data={userOrganizationsByOrganization}
        renderItem={({
          item,
          index,
        }: {
          item: UserOrganizationType;
          index: number;
        }) => {
          return (
            <UserOrganizationItemListComponent
            key={item.id}
            userorganization={item}
            setFormSection={setFormSection}
            />
          );
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="usuarios" />}
        className="flex-1"
      />
    </>
  );
}
