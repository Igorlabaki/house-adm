
import { StyledView } from "styledComponents";

import OrcamentoFilter from "@components/list/OrcamentoFilter";
import { OrcamentoFlatList } from "./components/list/orcamentoFlatList ";

export function PendingScreen() {
  return (
    <StyledView className="bg-gray-dark flex-1 p-5 flex flex-col h-full w-full">
      <OrcamentoFilter />
      <OrcamentoFlatList />
    </StyledView>
  );
}
