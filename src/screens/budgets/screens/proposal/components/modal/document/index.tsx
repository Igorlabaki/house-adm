import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { useState } from "react";
import { DocumentFlatList } from "./list/flat-list";
import { DocumentModal } from "./modal";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";
import { fecthDocuments } from "@store/document/document-slice";
import { Venue } from "@store/venue/venueSlice";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { ProposalType } from "type";

export default function DocumentScreen() {
  const queryParams = new URLSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
   const proposal: ProposalType = useSelector<RootState>(
      (state: RootState) => state.proposalList.proposal
    );
  return (
    <StyledView className="bg-gray-dark h-full">
      <StyledPressable
        onPress={() => setIsModalOpen(true)}
        className="
          justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
          rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%] mt-3
        "
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Novo Documento
        </StyledText>
      </StyledPressable>
      <SearchFilterListByQueryComponent
        entityId={proposal.id}
        queryName="title"
        entityName="proposalId"
        fectData={fecthDocuments}
        queryParams={queryParams}
      />
      <DocumentFlatList />
      {isModalOpen && (
        <DocumentModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="CREATE"
        />
      )}
    </StyledView>
  );
}
