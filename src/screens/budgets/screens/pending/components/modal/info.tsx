import { useEffect, useState } from "react";
import { BugdetType, ValueType } from "../../../../../../type";
import { Modal, Text, View, Pressable } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather, Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "react-native-format-currency";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../../../store";
import { fecthValues } from "../../../../../../store/value/valuesSlice";
import { MaterialIcons } from "@expo/vector-icons";
import { BudgetModal } from ".";
interface BudgetModalProps {
  budget?: BugdetType;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BudgetInfoModal({
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
    <Modal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      animationType="fade"
    >
      <View className="flex-1 bg-gray-dark pt-10 relative">
        <Pressable
          className="absolute top-4 left-5"
          onPress={() => setIsModalOpen(false)}
        >
          <MaterialCommunityIcons
            name="arrow-left-thin"
            size={24}
            color="white"
          />
        </Pressable>
        <Pressable
          className="absolute top-4 right-5"
          onPress={() => setEditmodal(true)}
        >
          <MaterialIcons name="mode-edit" size={20} color="white" />
        </Pressable>
        <View className="flex justify-center items-center w-full">
          <Text className="md:text-[21px] w-full  text-[18px] text-center py-5 text-white font-semibold">
            Informacoes do Evento
          </Text>
          <View className="flex flex-row justify-between items-center w-[80%] mx-auto mt-5         ">
            <View className="flex flex-col justify-center items-center gap-y-1">
              <Ionicons name="people" size={20} color="white" />
              <Text className="text-white text-[11px]">
                {budget.convidados}
              </Text>
            </View>
            <View className="flex flex-col justify-center items-center gap-y-1">
              <Ionicons name="calendar-outline" size={20} color="white" />
              <Text className="text-white text-[11px]">
                {format(budget?.dataInicio, "dd/MM/yyyy")}
              </Text>
            </View>
            <View className="flex flex-col justify-center items-center gap-y-1">
              <Feather name="clock" size={20} color="white" />
              <View className="flex-row">
                <Text className="text-white text-[11px]">
                  {format(budget?.dataInicio, "HH:mm")}
                </Text>
                <Text className="text-white text-[11px]">/</Text>
                <Text className="text-white text-[11px]">
                  {format(budget?.dataFim, "HH:mm")}
                </Text>
              </View>
            </View>
          </View>
          <View className="w-[70%] mx-auto mt-10">
            <View className="flex-row justify-between items-center">
              <Text className="text-[13px] text-white  font-semibold">
                Valor Base
              </Text>
              <Text className="text-[13px] text-white  font-semibold">
                {
                  formatCurrency({
                    amount: budget?.valorBase,
                    code: "BRL",
                  })[0]
                }
              </Text>
            </View>
            {budget.qtdHorasExtras > 0 && (
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-[13px] text-white  font-semibold">
                  Hora Extra
                </Text>
                <Text className="text-[13px] text-white  font-semibold">
                  {
                    formatCurrency({
                      amount: budget.qtdHorasExtras * budget.valorHoraExtra,
                      code: "BRL",
                    })[0]
                  }
                </Text>
              </View>
            )}
            {budget.limpeza && limpeza && (
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-[13px] text-white  font-semibold">
                  Limpeza
                </Text>
                <Text className="text-[13px] text-white  font-semibold">
                  {
                    formatCurrency({
                      amount: valueList.values.find(
                        (item: ValueType) => item.titulo === "Limpeza"
                      )?.valor,
                      code: "BRL",
                    })[0]
                  }
                </Text>
              </View>
            )}
            {budget.recepcionista && recepcionista && (
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-[13px] text-white  font-semibold">
                  Recepcionista
                </Text>
                <Text className="text-[13px] text-white  font-semibold">
                  {
                    formatCurrency({
                      amount: valueList.values.find(
                        (item: ValueType) => item.titulo === "Recepcionista"
                      )?.valor,
                      code: "BRL",
                    })[0]
                  }
                </Text>
              </View>
            )}
            {budget.seguranca && seguranca && (
              <View className="flex-row justify-between items-center mt-1">
                <Text className="text-[13px] text-white  font-semibold">
                  Seguranca
                </Text>
                <Text className="text-[13px] text-white  font-semibold">
                  {
                    formatCurrency({
                      amount: valueList.values.find(
                        (item: ValueType) => item.titulo === "Seguranca"
                      )?.valor,
                      code: "BRL",
                    })[0]
                  }
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row justify-center items-center gap-x-3 mt-5">
            <Text className="text-[13px] text-white  font-semibold">
              Total:
            </Text>
            <Text className="text-[13px] text-white  font-semibold">
              {
                formatCurrency({
                  amount: budget?.total,
                  code: "BRL",
                })[0]
              }
            </Text>
          </View>
          <View className="flex gap-y-2 mt-5 w-[70%] ">
            <Text className="text-white font-semibold">Descricao :</Text>
            <View className="bg-[#313338]  px-2 py-1 rounded-md overflow-hidden">
              <Text  className="text-white font-semibold">{budget.texto}</Text>
            </View>
          </View>
          <View className="mt-5 flex-col justify-start items-center">
            <View className="flex-row justify-center items-center gap-x-3 mt-5">
              <Text className="text-[13px] text-white  font-semibold">
                *O valor da hora extra
              </Text>
              <Text className="text-[13px] text-white  font-semibold">
                {
                  formatCurrency({
                    amount: budget?.valorHoraExtra,
                    code: "BRL",
                  })[0]
                }
              </Text>
            </View>
            <View>
              <Text
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
              </Text>
            </View>
          </View>
        </View>
        <View className="flex justify-center items-center w-full mt-10">
          <Text className="md:text-[21px] w-full  text-[18px] text-center py-5 text-white font-semibold">
            Informacoes Pessoais
          </Text>
          <View className="w-[70%] flex-row justify-between items-center mx-auto">
            <Text className="text-[13px] text-white  font-semibold">
              Nome :
            </Text>
            <Text className="text-[13px] text-white  font-semibold">
              {budget.nome}
            </Text>
          </View>
          <View className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
            <Text className="text-[13px] text-white  font-semibold">
              Email :
            </Text>
            <Text className="text-[13px] text-white  font-semibold">
              {budget.email}
            </Text>
          </View>
          <View className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
            <Text className="text-[13px] text-white  font-semibold">
              Whatsapp :
            </Text>
            <Text className="text-[13px] text-white  font-semibold">
              {budget.telefone}
            </Text>
          </View>
          <View className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
            <Text className="text-[13px] text-white  font-semibold">
              Ja conhece o espaco :
            </Text>
            <Text className="text-[13px] text-white  font-semibold">
              {budget.conheceEspaco ? "Sim" : "Nao"}
            </Text>
          </View>
          <View className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
            <Text className="text-[13px] text-white  font-semibold">
              Por onde nos conheceu :
            </Text>
            <Text className="text-[13px] text-white  font-semibold">
              {budget.trafegoCanal}
            </Text>
          </View>
        </View>
      </View>
      <BudgetModal
        isModalOpen={editmodal}
        setIsModalOpen={setEditmodal}
        type="UPDATE"
        budget={budget}
      />
    </Modal>
  );
}
