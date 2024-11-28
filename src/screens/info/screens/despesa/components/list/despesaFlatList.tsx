import { RootState } from "@store/index";
import { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { DespesaType } from "type";
import { DespesaItemFlatList } from "./despesaItemFlatList";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { ListEmpty } from "@components/list/ListEmpty";
import { styled } from "nativewind";
import { fetchDespesas } from "@store/despesa/despesaSlice";

export const StyledFlatList = styled(FlatList<DespesaType>);

export function DespesaFlatList() {
  const dispatch = useDispatch();
  const despesaList = useSelector((state: RootState) => state.despesaList);
  const [despesaTipo, setDespesaTipo] = useState<
    "Recorrente" | "Nao Recorrente"
  >("Recorrente");

  useEffect(() => {
    /* @ts-ignore */
    dispatch(fetchDespesas(""));
  }, [dispatch]);

  if (despesaList?.loading) {
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
          onPress={() => setDespesaTipo("Recorrente")}
        >
          <StyledText className={`font-semibold text-custom-white ${despesaTipo === 'Nao Recorrente' && 'opacity-50'}`}>
            Recorrentes
          </StyledText>
        </StyledPressable>
        <StyledPressable
          className=""
          onPress={() => setDespesaTipo("Nao Recorrente")}
        >
          <StyledText className={`font-semibold text-custom-white ${despesaTipo === 'Recorrente' && 'opacity-50'}`}>
            Esporadico
          </StyledText>
        </StyledPressable>
      </StyledView>
      <StyledFlatList
        removeClippedSubviews={false}
        keyExtractor={(item: DespesaType) => item.id}
        data={despesaTipo === "Recorrente" ? despesaList?.despesas?.recorrentes?.list : despesaList?.despesas?.naoRecorrentes?.list}
        renderItem={({ item, index }: { item: DespesaType; index: number }) => {
          return <DespesaItemFlatList despesa={item} key={item.id} />;
        }}
        ItemSeparatorComponent={() => <ItemSeparatorList />}
        ListEmptyComponent={() => <ListEmpty dataType="despesa" />}
        className="flex-1"
      />
    </>
  );
}
