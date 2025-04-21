import { ProposalType } from "type";
import React, { useState } from "react";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { GuestList } from "./list/guest-list";
import { GuestModal } from "./modal/guest-modal";
import { fecthGuests } from "@store/guest/guest-slice";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SearchFilterListByQueriesComponent } from "@components/list/searchFilterListByQueries";
import { shareLink } from "function/share-link";
import { Entypo } from "@expo/vector-icons";

export default function GuestScreen() {
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
            Novo Convidado
          </StyledText>
        </StyledPressable>
        <StyledPressable
          onPress={() =>
            shareLink({
              proposal,
              url: "lista-de-convidados",
              listType: "convidados",
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
          { name: "type", value: "GUEST" },
          { name: "proposalId", value: proposal?.id },
        ]}
        fectData={fecthGuests}
        queryName="name"
        queryParams={queryParams}
      />
      <GuestList />
      {isModalOpen && (
        <GuestModal
          type="CREATE"
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </StyledView>
  );
}
