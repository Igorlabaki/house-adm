
import { styled } from "nativewind";
import { ListEmpty } from "@components/list/ListEmpty";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { StyledText, StyledView } from "styledComponents";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { UserOrganizationType } from "type";
import { User } from "@store/auth/authSlice";
import { UserItemList } from "./user-item-list";
import React from "react";

interface UserParams {
  userOrganization?: UserOrganizationType;
  setFormSection: React.Dispatch<
    React.SetStateAction<"USER" | "VENUE" | "NEW_USER" | "NEW_VENUE">
  >;
}

export const StyledFlatList = styled(FlatList<User>);

export const UserFlatList = React.memo(
  ({ setFormSection}: UserParams) => {

    const isLoading = useSelector(
      (state: RootState) => state.userList.loading
    );

    const users : User[] = useSelector(
      (state: RootState) => state.userList.users
    );

    if (isLoading) {
      return (
        <StyledView className="w-full flex justify-center items-center">
          <ActivityIndicator size="large" color="white" />
          <StyledText className="text-white">Loading</StyledText>
        </StyledView>
      );
    }

    return (
      <StyledFlatList
        className="flex-1 w-full"
        keyExtractor={(item: User) => item.id}
        data={users}
        renderItem={({ item }: { item: User }) => (
          <UserItemList
            item={item}
            setFormSection={setFormSection}
          />
        )}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="Usuario" />}
        windowSize={5}
        maxToRenderPerBatch={10}
        initialNumToRender={4}
      />
    );
  }
);
