import { RootState } from "@store/index";
import { Venue } from "@store/venue/venueSlice";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SeasonalFeeFormComponent } from "../form";

import { SearchFilterListByQueriesComponent } from "@components/list/searchFilterListByQueries";
import { fecthDiscountFees } from "@store/discount-fee/discount-fee";
import { SeasonalFeeFlatList } from "./list";

export default function DiscountScreenComponent() {
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
          Novo Desconto
        </StyledText>
      </StyledPressable>
      <SeasonalFeeFormComponent
        type="DISCOUNT"
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
      <SearchFilterListByQueriesComponent
        entityQueries={[
          { name: "venueId", value: venue.id },
          { name: "type", value: "DISCOUNT" },
        ]}
        queryName="title"
        fectData={fecthDiscountFees}
        queryParams={queryParams}
      />
      <SeasonalFeeFlatList />
    </StyledView>
  );
}
