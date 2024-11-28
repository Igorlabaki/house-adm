import { Feather, Ionicons } from "@expo/vector-icons";
import { AppDispatch, RootState } from "@store/index";
import { fecthValues } from "@store/value/valuesSlice";
import { format } from "date-fns";
import moment from "moment";
import React, { useEffect } from "react";
import { formatCurrency } from "react-native-format-currency";
import { useDispatch, useSelector } from "react-redux";
import { StyledText, StyledView } from "styledComponents";

import { BugdetType, Pagamento, ValueType } from "type";

export default function InfoEventos() {
  const valueList = useSelector((state: RootState) => state.valueList);
  const dispatch = useDispatch<AppDispatch>();

  const {orcamento} = useSelector((state: RootState) => state.orcamentosById);
 
  useEffect(() => {
    dispatch(fecthValues());
  }, []);

  const limpeza = valueList.values.find(
    (item: ValueType) => item.titulo === "Limpeza"
  )?.valor;
  const seguranca = valueList.values.find(
    (item: ValueType) => item.titulo === "Seguranca"
  )?.valor;
  const recepcionista = valueList.values.find(
    (item: ValueType) => item.titulo === "Recepcionista"
  )?.valor;

  return (
    <StyledView className="flex  justify-center items-center w-full mt-5">
      <StyledText className="md:text-[21px] w-full  text-[18px] text-center py-5 text-white font-semibold">
        Informacoes do Evento
      </StyledText>
      <StyledView className="flex flex-row justify-between items-center w-[80%] mx-auto mt-5 relative">
        <StyledView className="flex flex-col justify-center items-center gap-y-1">
          <Ionicons name="people" size={20} color="white" />
          <StyledText className="text-white text-[11px]">
            {orcamento?.convidados}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-col justify-center items-center gap-y-1 ml-10">
          <Ionicons name="calendar-outline" size={20} color="white" />
          <StyledText className="text-white text-[11px]">
            {orcamento?.dataInicio && format(orcamento?.dataInicio, "dd/MM/yyyy")}
          </StyledText>
        </StyledView>
        <StyledView className="flex flex-col justify-center items-center gap-y-1">
          <Feather name="clock" size={20} color="white" />
          <StyledView className="flex-row">
            <StyledText className="text-white text-[11px]">
              {moment.utc(orcamento?.dataInicio).format("HH:mm")}
            </StyledText>
            <StyledText className="text-white text-[11px]">/</StyledText>
            <StyledText className="text-white text-[11px]">
              {moment.utc(orcamento?.dataFim).format("HH:mm")}
            </StyledText>
          </StyledView>
        </StyledView>
      </StyledView>
      <StyledView className="w-[70%] mx-auto mt-10">
        <StyledView className="flex-row justify-between items-center">
          <StyledText className="text-[13px] text-white  font-semibold">
            Valor Base
          </StyledText>
          <StyledText className="text-[13px] text-white  font-semibold">
            {
              formatCurrency({
                amount: Number(orcamento?.valorBase?.toFixed(2)),
                code: "BRL",
              })[0]
            }
          </StyledText>
        </StyledView>
        {orcamento?.qtdHorasExtras > 0 && (
          <StyledView className="flex-row justify-between items-center mt-1">
            <StyledText className="text-[13px] text-white  font-semibold">
              Hora Extra
            </StyledText>
            <StyledText className="text-[13px] text-white  font-semibold">
              {
                formatCurrency({
                  amount: Number(
                    (orcamento?.qtdHorasExtras * orcamento?.valorHoraExtra)?.toFixed(2)
                  ),
                  code: "BRL",
                })[0]
              }
            </StyledText>
          </StyledView>
        )}
        {orcamento?.limpeza && limpeza && (
          <StyledView className="flex-row justify-between items-center mt-1">
            <StyledText className="text-[13px] text-white  font-semibold">
              Limpeza
            </StyledText>
            <StyledText className="text-[13px] text-white  font-semibold">
              {
                formatCurrency({
                  amount: valueList.values.find(
                    (item: ValueType) => item.titulo === "Limpeza"
                  )?.valor,
                  code: "BRL",
                })[0]
              }
            </StyledText>
          </StyledView>
        )}
        {orcamento?.recepcionista && recepcionista && (
          <StyledView className="flex-row justify-between items-center mt-1">
            <StyledText className="text-[13px] text-white  font-semibold">
              Recepcionista
            </StyledText>
            <StyledText className="text-[13px] text-white  font-semibold">
              {
                formatCurrency({
                  amount: valueList.values.find(
                    (item: ValueType) => item.titulo === "Recepcionista"
                  )?.valor,
                  code: "BRL",
                })[0]
              }
            </StyledText>
          </StyledView>
        )}
        {orcamento?.seguranca && seguranca && (
          <StyledView className="flex-row justify-between items-center mt-1">
            <StyledText className="text-[13px] text-white  font-semibold">
              Seguranca
            </StyledText>
            <StyledText className="text-[13px] text-white  font-semibold">
              {
                formatCurrency({
                  amount: valueList.values.find(
                    (item: ValueType) => item.titulo === "Seguranca"
                  )?.valor,
                  code: "BRL",
                })[0]
              }
            </StyledText>
          </StyledView>
        )}
      </StyledView>
      <StyledView className="flex-row justify-center items-center gap-x-3 mt-5">
        <StyledText className="text-[13px] text-white  font-semibold">
          Total:
        </StyledText>
        <StyledText className="text-[13px] text-white  font-semibold">
          {
            formatCurrency({
              amount: Number((orcamento?.total)?.toFixed(2)),
              code: "BRL",
            })[0]
          }
        </StyledText>
      </StyledView>
      <StyledView className="flex gap-y-2 mt-5 w-[70%] ">
        <StyledText className="text-white font-semibold">
          Descricao :
        </StyledText>
        <StyledView className="bg-[#313338]  px-2 py-1 rounded-md overflow-hidden">
          <StyledText className="text-white font-semibold">
            {orcamento?.texto}
          </StyledText>
        </StyledView>
      </StyledView>
      {orcamento?.feedback && (
        <StyledView className="flex gap-y-2 mt-5 w-[70%] ">
          <StyledText className="text-white font-semibold">
            Feedback :
          </StyledText>
          <StyledView className="bg-[#313338]  px-2 py-1 rounded-md overflow-hidden">
            <StyledText className="text-white font-semibold">
              {orcamento?.feedback}
            </StyledText>
          </StyledView>
        </StyledView>
      )}
      <StyledView className="mt-5 flex flex-col justify-center items-center w-[70%] mx-auto overflow-hidden">
        <StyledView className="flex-row justify-between w-full items-center">
          <StyledText className="text-[13px] text-white   font-semibold">
            * Valor por pessoa {"  "}
          </StyledText>
          <StyledText className="text-[13px] text-white  font-semibold">
            {
              formatCurrency({
                amount: Number(
                  (
                    Number(orcamento?.total?.toFixed(2)) / orcamento?.convidados
                  )?.toFixed(0)
                ),
                code: "BRL",
              })[0]
            }
          </StyledText>
        </StyledView>
        <StyledView className="flex-row justify-between  w-full  items-center">
          <StyledText className="text-[13px] text-white  font-semibold">
            * Valor da hora Extra {"  "}
          </StyledText>
          <StyledText className="text-[13px] text-white  font-semibold">
            {
              formatCurrency({
                amount: Number(orcamento?.valorHoraExtra?.toFixed(2)),
                code: "BRL",
              })[0]
            }
          </StyledText>
        </StyledView>
      </StyledView>
    </StyledView>
  );
}
