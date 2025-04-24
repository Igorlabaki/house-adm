import { StyledView } from "styledComponents";
import { ProposalFlatList } from "./components/list/proposal-flat-list ";
import { ProposalFilter } from "screens/budgets/screens/proposal/components/list/proposal-filter-list";

export function PendingScreen() {
  return (
    <StyledView className="bg-gray-dark flex-1 pt-5 flex flex-col h-full w-full ">
      <ProposalFilter />
      <ProposalFlatList />
    </StyledView>
  );
}
