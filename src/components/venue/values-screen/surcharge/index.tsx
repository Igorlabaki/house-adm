import { RootState } from "@store/index";
import { fecthSurchargeFees } from "@store/surcharge-fee/surcharge-fee";
import { Venue } from "@store/venue/venueSlice";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SeasonalFeeFormComponent } from "../form";
import { SeasonalFeeFlatList } from "./list";
import { SearchFilterListByQueriesComponent } from "@components/list/searchFilterListByQueries";

export default function SurchargeScreenComponent() {
  const queryParams = new URLSearchParams();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  return (
    <StyledView className="bg-gray-dark flex-1 pt-5 flex flex-col h-full w-full">
      <StyledPressable
        onPress={() => setIsModalOpen(true)}
        className="
                justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%]"
      >
        <StyledText className="text-white text-sm font-bold text-center">
          Novo Adicional
        </StyledText>
      </StyledPressable>

      <SeasonalFeeFormComponent
        type="SURCHARGE"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <SearchFilterListByQueriesComponent
        entityQueries={[
          {name:"venueId", value: venue.id},
          {name: "type" , value: "SURCHARGE"}
        ]}
        queryName="title"
        fectData={fecthSurchargeFees}
        queryParams={queryParams}
      />
      <SeasonalFeeFlatList />
    </StyledView>
  );
}
