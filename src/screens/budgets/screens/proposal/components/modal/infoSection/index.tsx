import { ProposalType } from "type";
import { InfoEventos } from "./evento";
import { InfoPessoais } from "./pessoais";
import { StyledView } from "styledComponents";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";

export function InfoSection() {
  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );

  return (
    <StyledView className="flex">
      {proposal && (
        <StyledView className={`flex-1 flex-grow flex-col relative `}>
          <InfoEventos />
          <InfoPessoais />
        </StyledView>
      )}
    </StyledView>
  );
}

export default InfoSection;
