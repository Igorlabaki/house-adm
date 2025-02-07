import { StyledView } from 'styledComponents';
import { ProposalAprovedList } from './list/proposal-aproved-flat-item-list';
import { ApprovedProposalFilter } from './list/proposal-approved-filter-list';

export  function Concludedcreen() {
  return (
    <StyledView className="bg-gray-dark flex-1 pt-5 flex flex-col h-full w-full">
      <ApprovedProposalFilter />
      <ProposalAprovedList />
    </StyledView>
  )
}

