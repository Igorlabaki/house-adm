import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "@store/index";
import { fecthQuestions } from "@store/question/questionSlice";
import { StyledText, StyledView } from "styledComponents";
import { ActivityIndicator, FlatList } from "react-native";
import { QuestionType } from "type";
import QuestionItemFlatList from "./questionItemFlatList";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { ListEmpty } from "@components/list/ListEmpty";
import { styled } from "nativewind";

export const StyledFlatList = styled(FlatList<QuestionType>);

export function QuestionFlatList() {
  const questionList = useSelector((state: RootState) => state.questionList);

  if (questionList.loading) {
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
        keyExtractor={(item: QuestionType) => item.id}
        data={questionList?.questions}
        renderItem={({
          item,
          index,
        }: {
          item: QuestionType;
          index: number;
        }) => {
          return (
            <QuestionItemFlatList
              question={item}
              key={item.id}
              index={index + 1}
            />
          );
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="pergunta" />}
        className="flex-1"
      />
    </>
  );
}
