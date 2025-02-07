import { styled } from "nativewind";
import { RootState } from "@store/index";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListEmpty } from "@components/list/ListEmpty";
import { ExpenseType } from "@store/expense/expenseSlice";
import { ActivityIndicator, FlatList } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { ExpenseItemFlatList } from "./Item-flat-list";

export const StyledFlatList = styled(FlatList<ExpenseType>);

export function ExpenseFlatList() {
  const expenseList = useSelector((state: RootState) => state.expenseList);
  const [expenseTipo, setExpenseTipo] = useState<boolean>(true);

  if (expenseList?.loading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <>
      <StyledView className="flex my-5 flex-row w-full justify-center items-center gap-x-5">
        <StyledPressable
          className=""
          onPress={() => setExpenseTipo(true)}
        >
          <StyledText className={`font-semibold text-custom-white ${expenseTipo === false && 'opacity-50'}`}>
            Recorrentes
          </StyledText>
        </StyledPressable>
        <StyledPressable
          className=""
          onPress={() => setExpenseTipo(false)}
        >
          <StyledText className={`font-semibold text-custom-white ${expenseTipo === true && 'opacity-50'}`}>
            Esporadico
          </StyledText>
        </StyledPressable>
      </StyledView>
      <StyledFlatList
        removeClippedSubviews={false}
        keyExtractor={(item: ExpenseType) => item.id}
        data={expenseList?.expenses.filter((item: ExpenseType) =>  item.recurring === expenseTipo)}
        renderItem={({ item, index }: { item: ExpenseType; index: number }) => {
          return <ExpenseItemFlatList expense={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="despesa" />}
        className="flex-1"
      />
    </>
  );
}
