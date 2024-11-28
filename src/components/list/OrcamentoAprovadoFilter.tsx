import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { FontAwesome } from "@expo/vector-icons";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import { BudgetModal } from "../../screens/budgets/screens/pending/components/modal";
import { fecthOrcamentosAprovados } from "../../store/budgetAprovado/bugetAprovadoSlice";

export default function OrcamentoAprovadoFilter() {
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<any>(new Date().getFullYear());

  const dispatch = useDispatch();
  const orcamentosAprovadoList = useSelector(
    (state: RootState) => state.orcamentosAprovadoList
  );
  const [debouncedQuery] = useDebounce(query, 500);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryParams = new URLSearchParams();

  useEffect(() => {
    if (debouncedQuery) queryParams.append("nome", debouncedQuery);
    queryParams.append("year", year || new Date().getFullYear());
    if (month) queryParams.append("month", month.toString());

    dispatch(
      fecthOrcamentosAprovados({
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
        <StyledPressable
          className="bg-gray-dark"
          onPress={() => setIsModalOpen(true)}
        >
          <StyledText className="text-custom-white font-semibold">
            Novo Orcamento
          </StyledText>
        </StyledPressable>
        <StyledPressable
          className="cursor-pointer flex"
          onPress={() =>
            dispatch(
              fecthOrcamentosAprovados({ url: `${queryParams.toString()}` })
            )
          }
        >
          <FontAwesome name="refresh" size={16} color="white" />
        </StyledPressable>
      </StyledView>
      <StyledView className="w-full py-3 px-2 flex justify-start items-center  rounded-md bg-white flex-row my-3">
        <EvilIcons name="search" size={24} color="black" />
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
                    ? "bg-gray-800 color-red font-semibold border-[1px] border-white"
                    : "bg-gray-400"
                } 
                rounded-sm cursor-pointer h-7 w-12  flex justify-center items-center`}
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
          {orcamentosAprovadoList.orcamentosAprovado.length} orcamentos
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
