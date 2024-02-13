import { useEffect, useState } from "react";
import { FlatList, View, ActivityIndicator, Text } from "react-native";
import { QuestionType } from "../../../../../../type";
import { RootState } from "../../../../../../store";
import { useSelector, useDispatch } from "react-redux";
import { fecthTexts } from "../../../../../../store/text/textSlice";
import { ListEmpty } from "../../../../../../components/list/ListEmpty";
import { ItemSeparatorList } from "../../../../../../components/list/itemSeparatorList";
import QuestionItemFlatList from "./questionItemFlatList";
import { fecthQuestions } from "../../../../../../store/question/questionSlice";

export function QuestionFlatList() {
  const dispatch = useDispatch();
  const questionList = useSelector((state: RootState) => state.questionList);

  useEffect(() => {
    dispatch(fecthQuestions());
  }, []);

  if (questionList.loading) {
    return (
      <View className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <Text className="text-white">Loading</Text>
      </View>
    );
  }

  return (
    <>
      <FlatList
        keyExtractor={(item: QuestionType) => item.id}
        data={questionList?.questions}
        renderItem={({ item, index }: { item: QuestionType, index: number }) => {
          return <QuestionItemFlatList question={item} key={item.id} index={index + 1} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="question" />}
        className="flex-1"
      />
    </>
  );
}
