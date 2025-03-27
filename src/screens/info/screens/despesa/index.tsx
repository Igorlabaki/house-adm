import { useState } from "react";
import { ExpenseModal } from "./components/modal";
import { fecthExpenses } from "@store/expense/expenseSlice";
import { ExpenseFlatList } from "./components/list/flat-list";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { SearchFilterListComponent } from "@components/list/searchFilterList";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";
import { Venue } from "@store/venue/venueSlice";
import { useSelector } from "react-redux";
import { RootState } from "@store/index";

export function ExpenseScreen() {
  const queryParams = new URLSearchParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);
  return (
    <StyledView className="bg-gray-dark flex-1 pt-5 flex flex-col h-full w-full">
      {venue.permissions.includes("EDIT_EXPENSES") && (
        <StyledPressable
          onPress={() => setIsModalOpen(true)}
          className="
                 justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                 rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%]"
        >
          <StyledText className="text-white text-sm font-bold text-center">
            Nova Despesa
          </StyledText>
        </StyledPressable>
      )}
      <SearchFilterListByQueryComponent
        entityId={venue.id}
        queryName="name"
        entityName="venueId"
        fectData={fecthExpenses}
        queryParams={queryParams}
      />
      <ExpenseFlatList />
      {isModalOpen && (
        <ExpenseModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="CREATE"
        />
      )}
    </StyledView>
  );
}
