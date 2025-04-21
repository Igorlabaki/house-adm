import { ProposalType } from "type";
import React, { useState } from "react";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";

import { fecthWorkers } from "@store/worker/worker-slice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SearchFilterListByQueriesComponent } from "@components/list/searchFilterListByQueries";
import { WorkerList } from "./list/worker-list";
import { WorkerModal } from "./modal/worker-modal";
import { shareLink } from "function/share-link";
import { Entypo } from "@expo/vector-icons";

export default function WorkerScreen() {
  const queryParams = new URLSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const proposal: ProposalType = useSelector(
    (state: RootState) => state.proposalList.proposal
  );
  return (
    <StyledView className="w-full bg-gray-dark h-full pt-5">
      <StyledView className="flex flex-row justify-between items-center gap-x-3">
        <StyledPressable
          onPress={() => setIsModalOpen(true)}
          className="
            justify-center items-center bg-green-800 active:scale-95
            rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] w-[40%] mb-2 border-[0.6px] border-white border-solid"
        >
          <StyledText className="text-white text-sm font-bold text-center">
            Novo Colaborador
          </StyledText>
        </StyledPressable>
        <StyledPressable
          onPress={() =>
            shareLink({
              proposal,
              url: "lista-de-colaboradores",
              listType: "colaboradores",
            })
          }
          className="
            justify-center items-center bg-blue-800 active:scale-95 flex flex-row gap-x-2
            rounded-md px-4  py-2 shadow-lg ml-[0.25px] w-[40%] mb-2 border-[0.6px] border-white border-solid"
        >
          <StyledText className="text-custom-white text-sm font-bold text-center">
            Enviar Link
          </StyledText>
          <Entypo name="share" size={16} color="#faebd7" />
        </StyledPressable>
      </StyledView>
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
