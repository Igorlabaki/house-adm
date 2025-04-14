import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { UserOrganizationType } from "type";
import { ListEmpty } from "@components/list/ListEmpty";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { UserOrganizationItemListComponent } from "./item-list";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { User } from "@store/auth/authSlice";

export const StyledFlatList = styled(FlatList<UserOrganizationType>);

interface UserPermissionProps{
  setUser: React.Dispatch<React.SetStateAction<User>>
  setFormSection: React.Dispatch<React.SetStateAction<"USER" | "VENUE">>
}

export function UserOrganizationFlatList({setFormSection,setUser}: UserPermissionProps) {

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
            setUser={setUser}
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
