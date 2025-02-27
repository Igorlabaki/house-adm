import { ClauseType } from "type";
import React, { useEffect, useState } from "react";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";
import { EvilIcons } from "@expo/vector-icons";
import { ActivityIndicator } from "react-native";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { ListEmpty } from "@components/list/ListEmpty";
import { FlatList } from "react-native-gesture-handler";
import { styled } from "nativewind";

interface ClauseListComponentProps {
  selectedClauses: ClauseType[];
  setSelectedClauses: React.Dispatch<React.SetStateAction<ClauseType[]>>;
}

const StyledFlatList = styled(FlatList<ClauseType>);

export default function ClauseListComponent({
  setSelectedClauses,
  selectedClauses,
}: ClauseListComponentProps) {
  const [query, setQuery] = useState("");

  const clauseList: ClauseType[] = useSelector(
    (state: RootState) => state.clauseList.clauses
  );

  const loading: boolean = useSelector(
    (state: RootState) => state.clauseList.loading
  );

  const clausesToShow = selectedClauses
    ? [
        ...selectedClauses, // Exibe as cláusulas já selecionadas
        ...clauseList.filter(
          (clause) =>
            !selectedClauses.some((selected) => selected.title === clause.title)
        ), // Exibe as cláusulas que não foram selecionadas
      ]
    : clauseList;

  if (loading) {
    return (
      <StyledView className="h-full w-full flex justify-center items-center">
        <ActivityIndicator size="large" color="white" />
        <StyledText className="text-white">Loading</StyledText>
      </StyledView>
    );
  }

  return (
    <StyledView className="flex flex-col gap-2 my-3 h-[400px]">
      <StyledText className="text-[16px] text-white font-semibold">
        Selecione as cláusulas
      </StyledText>
      <StyledView>
        <StyledView className="w-full py-3 px-2 flex justify-start items-center  rounded-md bg-white flex-row my-3">
          <EvilIcons name="search" size={24} color="black" />
          <StyledTextInput
            onChangeText={(value) => setQuery(value)}
            value={query}
            placeholder={"Procurar..."}
            className="text-sm text-text-gray  outline-none  flex-1"
          />
        </StyledView>
      </StyledView>
      <StyledView className="flex-1">
        <StyledFlatList
          contentContainerStyle={{ flexGrow: 0 }} // Impede o crescimento excessivo
          removeClippedSubviews={false}
          keyExtractor={(item: ClauseType) => item.id}
          data={clausesToShow}
          initialNumToRender={4} // Exibe 10 itens inicialmente
          maxToRenderPerBatch={4} // Limita 5 itens por vez para carregar
          windowSize={4}
          renderItem={({ item }: { item: ClauseType }) => {
            if (
              !item.title
                .toLocaleLowerCase()
                .includes(query.toLocaleLowerCase())
            ) {
              return null;
            }

            // Descobrir a posição correta da cláusula dentro das selecionadas
            const selectedIndex = selectedClauses?.findIndex(
              (cl) => cl?.id === item?.id
            );
            const isSelected = selectedIndex !== -1;
            const position = isSelected ? selectedIndex + 1 : null;

            return (
              <StyledPressable
                key={item?.id}
                onPress={() => {
                  setSelectedClauses((prev) => {
                    if (isSelected) {
                      // Remove a cláusula e reordena as posições
                      return prev
                        .filter((cl) => cl.id !== item?.id)
                        .map((cl, index) => ({ ...cl, position: index + 1 }));
                    } else {
                      return [...prev, { ...item, position: prev.length + 1 }];
                    }
                  });
                }}
                className={`flex flex-col items-start justify-center px-5 py-5 w-full rounded-md overflow-hidden shadow-lg relative bg-[#313338]`}
              >
                {/* Mostra o número da posição apenas se estiver selecionado */}
                {isSelected && (
                  <StyledView className="absolute top-2 right-2 rounded-full">
                    <StyledView className="h-6 w-6 bg-blue-500 rounded-full flex justify-center items-center">
                      <StyledText className="text-white font-bold text-sm">
                        {position}
                      </StyledText>
                    </StyledView>
                  </StyledView>
                )}
                <StyledText className="text-[12px] text-white font-semibold">
                  {item?.title}
                </StyledText>
              </StyledPressable>
            );
          }}
          ItemSeparatorComponent={() => <ItemSeparatorList />}
          ListEmptyComponent={() => <ListEmpty dataType="clausula" />}
          className="flex-1" // Permite que a FlatList ocupe o espaço restante
        />
      </StyledView>
    </StyledView>
  );
}
