import { RootState } from "@store/index";
import { useDebounce } from "use-debounce";
import { FontAwesome } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { fetchDespesas } from "@store/despesa/despesaSlice";
import { ExpenseModal } from "screens/info/screens/despesa/components/modal";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";

export default function DespesaFilter() {
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [year, setYear] = useState<any>(new Date().getFullYear());
  const [despesaTipo, setDespesaTipo] = useState<"Recorrente" | "Esporadico">(
    "Recorrente"
  );
  const dispatch = useDispatch();
  const despesasList = useSelector(
    (state: RootState) => state.despesaList
  );

  const [debouncedQuery] = useDebounce(query, 500);

  const queryParams = new URLSearchParams();

  useEffect(() => {
    if (debouncedQuery) queryParams.append("query", debouncedQuery);
    queryParams.append("year", year || new Date().getFullYear());

    dispatch(
      fetchDespesas({
        url: `${queryParams.toString()}`,
      })
    );
  }, [debouncedQuery, year]);


  return (
    <StyledView className="pb-4">
      <StyledView className="w-full flex-row justify-between items-center">
      <StyledPressable
        className="bg-gray-dark"
        onPress={() => setIsModalOpen(true)}
      >
        <StyledText className="text-custom-white font-semibold">
          Nova Despesa
        </StyledText>
      </StyledPressable>
        <StyledPressable
          className="cursor-pointer flex"
          onPress={() =>
            dispatch(fetchDespesas({ url: `${queryParams.toString()}` }))
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
      <StyledView className="flex my-5 flex-row w-full justify-center items-center gap-x-10">
        <StyledPressable
          className=""
          onPress={() => setDespesaTipo("Recorrente")}
        >
          <StyledText
            className={`font-semibold text-custom-white ${
              despesaTipo === "Esporadico" && "opacity-50"
            }`}
          >
            Recorrentes
          </StyledText>
        </StyledPressable>
        <StyledPressable
          className=""
          onPress={() => setDespesaTipo("Esporadico")}
        >
          <StyledText
            className={`font-semibold text-custom-white ${
              despesaTipo === "Recorrente" && "opacity-50"
            }`}
          >
            Esporadico
          </StyledText>
        </StyledPressable>
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
