import { StyledPressable, StyledScrollView, StyledText, StyledView } from "styledComponents";
import { DespesaModal } from "./components/despesaModal";
import { useState } from "react";
import { DespesaFlatList } from "./components/list/despesaFlatList";
import { SearchFilterListComponent } from "@components/list/searchFilterList";
import { fetchDespesas } from "@store/despesa/despesaSlice";


export function DespesaScreen() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <StyledView className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
      <StyledPressable
        className="bg-gray-dark"
        onPress={() => setIsModalOpen(true)}
      >
        <StyledText className="text-custom-white font-semibold">
          Nova Despesa
        </StyledText>
      </StyledPressable>
      <SearchFilterListComponent fectData={fetchDespesas} />
      <DespesaFlatList />
      {isModalOpen && (   
        <DespesaModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="CREATE"
        />
      )}
    </StyledView>
  );
}
