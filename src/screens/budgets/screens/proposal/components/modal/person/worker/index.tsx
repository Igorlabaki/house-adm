import { ProposalType } from "type";
import React, { useState } from "react";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";

import { fecthWorkers } from "@store/worker/worker-slice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SearchFilterListByQueriesComponent } from "@components/list/searchFilterListByQueries";
import { WorkerList } from "./list/worker-list";
import { WorkerModal } from "./modal/worker-modal";

export default function WorkerScreen() {
  const queryParams = new URLSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );
  return (
    <StyledView className="w-full bg-gray-dark h-full pt-5">
      <StyledPressable
        onPress={() => setIsModalOpen(true)}
        className="
            justify-center items-center bg-green-800 active:scale-95
            rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-2 w-[50%] border-[0.6px] border-white border-solid"
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Novo Colaborador
        </StyledText>
      </StyledPressable>
      <SearchFilterListByQueriesComponent
        entityQueries={[
          { name: "type", value: "WORKER" },
          { name: "proposalId", value: proposal?.id },
        ]}
        fectData={fecthWorkers}
        queryName="name"
        queryParams={queryParams}
      />
      <WorkerList />
      {isModalOpen && (
        <WorkerModal
          type="CREATE"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </StyledView>
  );
}
