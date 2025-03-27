import { RootState } from "@store/index";
import { useDebounce } from "use-debounce";
import { FontAwesome } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { fecthProposals } from "@store/proposal/proposal-slice";
import { ProposalModal } from "screens/budgets/screens/proposal/components/modal";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import { useFocusEffect } from "@react-navigation/native";
import { Venue } from "@store/venue/venueSlice";

export function ProposalFilter() {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [year, setYear] = useState<any>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  const dispatch = useDispatch();
  const proposalsList = useSelector((state: RootState) => state.proposalList);

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);

  const [debouncedQuery] = useDebounce(query, 500);

  const queryParams = new URLSearchParams();

  useEffect(() => {
    queryParams.append("venueId", venue.id);
    if (debouncedQuery) queryParams.append("completeClientName", debouncedQuery);
    queryParams.append("year", year || new Date().getFullYear());
    if (month) queryParams.append("month", month.toString());

    dispatch(fecthProposals(`${queryParams.toString()}`));
  }, [debouncedQuery, month, year]);

  const months = [
    "Jan",
    "Fev",
    "Mar",
    "Abr",
    "Mai",
    "Jun",
    "Jul",
    "Ago",
    "Set",
    "Out",
    "Nov",
    "Dez",
  ];

  return (
    <StyledView className="pb-4">
      <StyledView className="w-full flex-row justify-between items-center py-2">
        {venue.permissions.includes("EDIT_PROPOSALS") && (
          <StyledPressable
            onPress={() => setIsModalOpen(true)}
            className="
                justify-center items-center bg-green-800 hover:bg-green-600 active:bg-green-700 
                rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-3 border-[0.6px] border-white border-solid w-[50%]"
          >
            <StyledText className="text-white text-sm font-bold text-center">
              Novo Orcamento
            </StyledText>
          </StyledPressable>
        )}
        <StyledPressable
          className="cursor-pointer flex absolute right-2"
          onPress={() =>
            dispatch(fecthProposals({ url: `${queryParams.toString()}` }))
          }
        >
          <FontAwesome name="refresh" size={16} color="white" />
        </StyledPressable>
      </StyledView>
      <StyledView className="w-full py-3 px-2 flex justify-start items-center  rounded-md bg-white flex-row my-3">
        <EvilIcons
          name="search"
          size={24}
          color="black"
          style={{ marginBottom: 5 }}
        />
        <StyledTextInput
          onChangeText={(value) => setQuery(value)}
          value={query}
          placeholder={"Search"}
          className="text-sm text-gray  outline-none  flex-1 flex justify-center items-center"
        />
      </StyledView>
      <StyledView className="py-4 flex flex-row justify-center items-center gap-x-4">
        <StyledPressable
          onPress={() => setYear((year) => year - 1)}
          className="mt-1"
        >
          <AntDesign name="left" size={10} color="white" />
        </StyledPressable>
        <StyledText className="text-lg text-white  text-center">
          {year}
        </StyledText>
        <StyledPressable
          className="text-lg text-white  text-center mt-1"
          onPress={() => setYear((year) => year + 1)}
        >
          <AntDesign name="right" size={10} color="white" />
        </StyledPressable>
      </StyledView>
      <StyledView
        className={
          "flex flex-row  gap-x-3 gap-y-2 flex-wrap justify-between items-center"
        }
      >
        {months.map((item: string, index: number) => {
          return (
            <StyledPressable
              key={index}
              onPress={() =>
                setMonth(() => {
                  if (index + 1 === month) {
                    return undefined;
                  }

                  return index + 1;
                })
              }
              className={`
                ${
                  index + 1 == month
                    ? "bg-gray-800  font-semibold border-[1px] border-white rounded-md"
                    : "bg-gray-400"
                } 
                rounded-md cursor-pointer h-7 w-12  flex justify-center items-center`}
            >
              <StyledText
                className={`${
                  index + 1 == month
                    ? "text-white font-semibold"
                    : "bg-gray-400"
                } `}
              >
                {item}
              </StyledText>
            </StyledPressable>
          );
        })}
      </StyledView>
      <StyledView className={"py-2"}>
        <StyledText className="text-white font-semibold">
          {proposalsList.proposals.length} orcamentos
        </StyledText>
      </StyledView>
      <ProposalModal
        isModalOpen={isModalOpen}
        setIsEditModalOpen={setIsModalOpen}
        type="CREATE"
      />
    </StyledView>
  );
}
