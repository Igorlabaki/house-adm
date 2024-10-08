import { format } from "date-fns";
import moment from "moment-timezone";
import { useEffect, useState } from "react";
import { AppDispatch, RootState } from "@store/index";
import { fecthValues } from "@store/value/valuesSlice";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "react-native-format-currency";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { BudgetModal } from ".";
import { BugdetType, ValueType } from "type";
import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledView,
} from "styledComponents";
import { KeyboardAvoidingView, Platform } from "react-native";
interface BudgetModalProps {
  budget?: BugdetType;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BudgetInfoModal({
  isModalOpen,
  setIsModalOpen,
  budget,
}: BudgetModalProps) {
  const valueList = useSelector((state: RootState) => state.valueList);
  const dispatch = useDispatch<AppDispatch>();
  const [editmodal, setEditmodal] = useState(false);

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
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => {
        setIsModalOpen(false)
      }}
      animationType="fade"
      className="bg-white"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
      <StyledScrollView className={"bg-gray-dark pt-10 relative"}>
        <StyledView className="flex-1 bg-gray-dark pt-10 relative">
          <StyledPressable
            className="absolute top-4 left-5"
            onPress={() => {
              setIsModalOpen(false)
            }}
          >
            <MaterialCommunityIcons
              name="arrow-left-thin"
              size={24}
              color="white"
            />
          </StyledPressable>
          <StyledPressable
            className="absolute top-4 right-5"
            onPress={() => setEditmodal(true)}
          >
            <MaterialIcons name="mode-edit" size={20} color="white" />
          </StyledPressable>
          <StyledView className="flex justify-center items-center w-full">
            <StyledText className="md:text-[21px] w-full  text-[18px] text-center py-5 text-white font-semibold">
              Informacoes do Evento
            </StyledText>
            <StyledView className="flex flex-row justify-between items-center w-[80%] mx-auto mt-5         ">
              <StyledView className="flex flex-col justify-center items-center gap-y-1">
                <Ionicons name="people" size={20} color="white" />
                <StyledText className="text-white text-[11px]">
                  {budget.convidados}
                </StyledText>
              </StyledView>
              <StyledView className="flex flex-col justify-center items-center gap-y-1">
                <Ionicons name="calendar-outline" size={20} color="white" />
                <StyledText className="text-white text-[11px]">
                  {format(budget?.dataInicio, "dd/MM/yyyy")}
                </StyledText>
              </StyledView>
              <StyledView className="flex flex-col justify-center items-center gap-y-1">
                <Feather name="clock" size={20} color="white" />
                <StyledView className="flex-row">
                  <StyledText className="text-white text-[11px]">
                    {moment.utc(budget?.dataInicio).format("HH:mm")}
                  </StyledText>
                  <StyledText className="text-white text-[11px]">/</StyledText>
                  <StyledText className="text-white text-[11px]">
                    {moment.utc(budget?.dataFim).format("HH:mm")}
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
                      amount: Number(budget?.valorBase.toFixed(2)),
                      code: "BRL",
                    })
                  [0]}
                </StyledText>
              </StyledView>
              {budget.qtdHorasExtras > 0 && (
                <StyledView className="flex-row justify-between items-center mt-1">
                  <StyledText className="text-[13px] text-white  font-semibold">
                    Hora Extra
                  </StyledText>
                  <StyledText className="text-[13px] text-white  font-semibold">
                    {
                      formatCurrency({
                        amount: Number(
                          (
                            budget.qtdHorasExtras * budget.valorHoraExtra
                          ).toFixed(2)
                        ),
                        code: "BRL",
                      })[0]
                    }
                  </StyledText>
                </StyledView>
              )}
              {budget.limpeza && limpeza && (
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
              {budget.recepcionista && recepcionista && (
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
              {budget.seguranca && seguranca && (
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
                    amount: Number((budget?.total).toFixed(2)),
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
                  {budget.texto}
                </StyledText>
              </StyledView>
            </StyledView>
            {budget.feedback && (
              <StyledView className="flex gap-y-2 mt-5 w-[70%] ">
                <StyledText className="text-white font-semibold">
                  Feedback :
                </StyledText>
                <StyledView className="bg-[#313338]  px-2 py-1 rounded-md overflow-hidden">
                  <StyledText className="text-white font-semibold">
                    {budget.feedback}
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
                          Number(budget?.total.toFixed(2)) / budget?.convidados
                        ).toFixed(0)
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
                      amount: Number(budget?.valorHoraExtra.toFixed(2)),
                      code: "BRL",
                    })[0]
                  }
                </StyledText>
              </StyledView>
            </StyledView>
          </StyledView>
          <StyledView className="flex justify-center items-center w-full mt-10">
            <StyledText className="md:text-[21px] w-full  text-[18px] text-center py-5 text-white font-semibold">
              Informacoes Pessoais
            </StyledText>
            <StyledView className="w-[70%] flex-row justify-between items-center mx-auto">
              <StyledText className="text-[13px] text-white  font-semibold">
                Nome :
              </StyledText>
              <StyledText className="text-[13px] text-white  font-semibold">
                {budget.nome}
              </StyledText>
            </StyledView>
            <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
              <StyledText className="text-[13px] text-white  font-semibold">
                Email :
              </StyledText>
              <StyledText className="text-[13px] text-white  font-semibold">
                {budget.email}
              </StyledText>
            </StyledView>
            <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
              <StyledText className="text-[13px] text-white  font-semibold">
                Whatsapp :
              </StyledText>
              <StyledText className="text-[13px] text-white  font-semibold">
                {budget.telefone}
              </StyledText>
            </StyledView>
            <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
              <StyledText className="text-[13px] text-white  font-semibold">
                Ja conhece o espaco :
              </StyledText>
              <StyledText className="text-[13px] text-white  font-semibold">
                {budget.conheceEspaco ? "Sim" : "Nao"}
              </StyledText>
            </StyledView>
            <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
              <StyledText className="text-[13px] text-white  font-semibold">
                Por onde nos conheceu :
              </StyledText>
              <StyledText className="text-[13px] text-white  font-semibold">
                {budget.trafegoCanal}
              </StyledText>
            </StyledView>
          </StyledView>
        </StyledView>
        {
          editmodal &&
          <BudgetModal
            isModalOpen={editmodal}
            setIsModalOpen={setEditmodal}
            type="UPDATE"
            budget={budget}
          />
        }
      </StyledScrollView>
      </KeyboardAvoidingView>
    </StyledModal>
  );
}

{
  /* 



<StyledView>
                <StyledText
                  className={`${
                    budget.aprovadoCliente
                      ? "text-white font-semibold"
                      : "text-red-700 font-semibold"
                  }`}
                >
                  *
                  {budget.aprovadoCliente
                    ? " Orcamento aprovado pelo cliente"
                    : "Orcamento nao aprovado pelo cliente"}
                </StyledText>
              </StyledView>*/
}
