import { useDebounce } from "use-debounce";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@store/index";
import { fecthOrcamentos } from "@store/budget/bugetSlice";
import { BudgetModal } from "screens/budgets/screens/pending/components/modal";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";

export default function OrcamentoFilter() {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [year, setYear] = useState<any>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  const dispatch = useDispatch();
  const orcamentosList = useSelector(
    (state: RootState) => state.orcamentosList
  );

  const [debouncedQuery] = useDebounce(query, 500);

  const queryParams = new URLSearchParams();

  useEffect(() => {
    if (debouncedQuery) queryParams.append("nome", debouncedQuery);
    queryParams.append("year", year || new Date().getFullYear());
    if (month) queryParams.append("month", month.toString());

    dispatch(
      fecthOrcamentos({
        url: `${queryParams.toString()}`,
      })
    );
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
      <StyledView className="w-full flex-row justify-between items-center">
        <StyledPressable className="" onPress={() => setIsModalOpen(true)}>
          <StyledText className="text-custom-white font-semibold">
            Novo Orcamento
          </StyledText>
        </StyledPressable>
        <StyledPressable
          className="cursor-pointer flex"
          onPress={() =>
            dispatch(fecthOrcamentos({ url: `${queryParams.toString()}` }))
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
      <StyledView className="py-2 flex flex-row justify-center items-center gap-x-4">
        <StyledPressable onPress={() => setYear((year) => year - 1)}>
          <AntDesign name="left" size={10} color="white" />
        </StyledPressable>
        <StyledText className="text-lg text-white  text-center">
          {year}
        </StyledText>
        <StyledPressable
          className="text-lg text-white  text-center"
          onPress={() => setYear((year) => year + 1)}
        >
          <AntDesign name="right" size={10} color="white" />
        </StyledPressable>
      </StyledView>
      <StyledView
        className={
          "flex flex-row  gap-x-3 gap-y-2 flex-wrap justify-center items-center"
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
          {orcamentosList.orcamentos.length} orcamentos
        </StyledText>
      </StyledView>
      <BudgetModal
        isModalOpen={isModalOpen}
        setIsEditModalOpen={setIsModalOpen}
        type="CREATE"
      />
    </StyledView>
  );
}
