import { Formik } from "formik";
import { useEffect } from "react";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { BugdetType, ValueType } from "../../../../../../type";
import { AppDispatch, RootState } from "../../../../../../store";
import { createOrcamentoFormSchema } from "../../../../../../zod/schemas/createOrcamentoFormZodSchema";
import {
  createOrcamentoValueAsync,
  updateOrcamentoByIdAsync,
} from "../../../../../../store/budget/bugetSlice";
import { Entypo } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { useState } from "react";
import { CreateOrcamentoFormData } from "../../../../../../zod/types/createOrcamentoFormZodType";
import DateTimePicker from "@react-native-community/datetimepicker";
import { TextInputMask } from "react-native-masked-text";
import { transformDate } from "../../../../../../function/transformData";
import { calcDuracaoFesta } from "../../../../../../function/calcDuracaoFesta";
import { calcExtras } from "../../../../../../function/calcExtra";
import { calcDiaria } from "../../../../../../function/calcDiaria";
import { calcQtdHoraExtra } from "../../../../../../function/calcQtdHoraExtra";
import { calcHorasExtras } from "../../../../../../function/calcHorasExtra";
import { fecthValues } from "../../../../../../store/value/valuesSlice";
import { format } from "date-fns";

interface BugdetFormProps {
  budget?: BugdetType;
}

export function BudgetForm({ budget }: BugdetFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.orcamentosList.error
  );

  const valueList = useSelector((state: RootState) => state.valueList);

  useEffect(() => {
    dispatch(fecthValues());
  }, []);


  const today = new Date();

  const [inicioDate, setInicioDate] = useState(new Date());
  const [fimDate, setFimDate] = useState(new Date());

  const [selected, setSelected] = useState<any>();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isHorarioInicioModalOpen, setIsHorarioInicioModalOpen] =
    useState(false);
  const [isHorarioFimModalOpen, setIsHorarioFimModalOpen] = useState(false);

  return (
    <ScrollView>
      <Formik
        validationSchema={toFormikValidationSchema<any>(
          createOrcamentoFormSchema
        )}
        initialValues={{
          conheceEspaco: budget?.conheceEspaco && budget?.conheceEspaco,
          convidados: budget?.convidados && budget?.convidados.toString(),
          horarioFim: budget?.dataFim && format(budget?.dataFim, "HH:mm"),
          horarioInicio: budget?.dataInicio && format(budget?.dataInicio, "HH:mm"),
          dataInicio: budget?.dataInicio && format(budget?.dataInicio, "dd/MM/yyyy"),
          email: budget?.email && budget?.email,
          limpeza: budget?.limpeza && budget?.limpeza,
          nome: budget?.nome && budget?.nome,
          recepcionista: budget?.recepcionista && budget?.recepcionista,
          seguranca: budget?.seguranca && budget?.seguranca,
          telefone: budget?.telefone && budget?.telefone,
          texto: budget?.texto && budget?.texto,
          trafegoCanal: budget?.trafegoCanal && budget?.trafegoCanal,
        }}
        validate={(values) => {
          try {
            createOrcamentoFormSchema.parse(values);
            return {}; // Retorna um objeto vazio se os dados estiverem válidos
          } catch (error) {
            return error.errors.reduce((acc, curr) => {
              const [field, message] = curr.message.split(": ");
              return {
                ...acc,
                [field]: message || "Erro de validação",
              };
            }, {});
          }
        }}
        onSubmit={async (values: any) => {
          const { dataFim, dataInicial } = transformDate({
            dataInicio: values.dataInicio,
            horarioFim: values.horarioFim,
            horarioInicio: values.horarioInicio,
          });

          const final = new Date(dataFim);
          const inicial = new Date(dataInicial);

          const duracaoFesta = calcDuracaoFesta(inicial, final);

          const dataExtra = valueList.values.map((item: ValueType) => {
            return { titulo: item.titulo, valor: item?.valor };
          });

          const extras = calcExtras(
            {
              limpeza:values?.limpeza,
              recepcionista: values.recepcionista,
              seguranca: values.seguranca,
            },
            dataExtra.find((item: ValueType) => item?.titulo === "Limpeza")?.valor,
            dataExtra.find((item: ValueType) => item?.titulo === "Seguranca")
              ?.valor,
            dataExtra.find((item: ValueType) => item?.titulo === "Recepcionista")
              ?.valor
          );

          const diaria = calcDiaria(
            values.convidados,
            dataExtra.find((item: ValueType) => item.titulo === "Por Pessoa")?.valor
          );

          const qtdHorasExtras = calcQtdHoraExtra(diaria, duracaoFesta);
          const valorHoraExtra = calcHorasExtras(diaria);
          const total = diaria + extras + valorHoraExtra * qtdHorasExtras;

          if(budget){
            const updatedOrcamento = await dispatch(
              updateOrcamentoByIdAsync({
                orcamentoId: budget.id,
                data: {
                  aprovadoAr756: false,
                  aprovadoCliente: false,
                  conheceEspaco: values?.conheceEspaco,
                  contato: false,
                  convidados:  Number(values?.convidados),
                  dataFim: final,
                  dataInicio: inicial,
                  email: values?.email,
                  feedback: "",
                  limpeza: values?.limpeza,
                  nome: values?.nome,
                  qtdHorasExtras: qtdHorasExtras,
                  recepcionista: values?.recepcionista || false,
                  seguranca: values?.seguranca || false,
                  telefone: values?.telefone,
                  texto: values?.texto,
                  total: total,
                  trafegoCanal: values?.trafegoCanal,
                  valorBase: diaria,
                  valorHoraExtra: valorHoraExtra,
                }
              })
            );
          
            if (updatedOrcamento.meta.requestStatus == "fulfilled") {
              Toast.show("Orcamento atualizado com sucesso." as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
            }
          
            if (updatedOrcamento.meta.requestStatus == "rejected") {
              Toast.show(error as string, 3000, {
                backgroundColor: "#FF9494",
                textColor: "white",
              });
            }
          }else{
            const newOrcamento = await dispatch(
              createOrcamentoValueAsync({
                aprovadoAr756: false,
                aprovadoCliente: false,
                conheceEspaco: values?.conheceEspaco,
                contato: false,
                convidados:  Number(values?.convidados),
                dataFim: final,
                dataInicio: inicial,
                email: values?.email,
                feedback: "",
                limpeza: values?.limpeza,
                nome: values?.nome,
                qtdHorasExtras: qtdHorasExtras,
                recepcionista: values?.recepcionista || false,
                seguranca: values?.seguranca || false,
                telefone: values?.telefone,
                texto: values?.texto,
                total: total,
                trafegoCanal: values?.trafegoCanal,
                valorBase: diaria,
                valorHoraExtra: valorHoraExtra,
              })
            );
          
            if (newOrcamento.meta.requestStatus == "fulfilled") {
              Toast.show("Orcamento criado com sucesso." as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
            }
          
            if (newOrcamento.meta.requestStatus == "rejected") {
              Toast.show(error as string, 3000, {
                backgroundColor: "#FF9494",
                textColor: "white",
              });
            }
          }
        }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          setFieldValue,
          getFieldMeta,
        }) => (
          <View className="w-[90%] mx-auto my-5 flex flex-col">
            <View className="flex flex-col gap-y-3">
              <View className="flex flex-col gap-y-1">
                <Text className="text-custom-gray text-[14px] font-semibold">
                  Nome
                </Text>
                <TextInput
                  onChangeText={handleChange("nome")}
                  onBlur={handleBlur("nome")}
                  value={values.nome}
                  placeholder={
                    errors.nome ? errors.nome.toString() : "Type the nome"
                  }
                  placeholderTextColor={
                    errors.nome ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.nome
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                />
              </View>
              <View className="flex flex-col gap-y-1">
                <Text className="text-custom-gray text-[14px] font-semibold">
                  Email
                </Text>
                <TextInput
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  placeholder={
                    errors.email ? errors.email.toString() : "Type the email"
                  }
                  placeholderTextColor={
                    errors.email ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.email
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                />
              </View>
              <View className="flex flex-col gap-y-1">
                <Text className="text-custom-gray text-[14px] font-semibold">
                  Telefone
                </Text>
                <TextInputMask
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.telefone
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                  type="cel-phone"
                  options={{
                    maskType: "BRL",
                    withDDD: true,
                    dddMask: "(99) ",
                  }}
                  onChangeText={handleChange("telefone")}
                  onBlur={handleBlur("telefone")}
                  value={values.telefone}
                />
                {errors?.telefone &&
                  errors?.telefone.toString() != "Required" && (
                    <Text className="text-red-700 font-semibold">
                      {errors.telefone.toString()}
                    </Text>
                  )}
              </View>
              <View className="flex flex-col gap-2">
                <Text className="font-semibold text-custom-gray text-[14px]">
                  Data do evento :
                </Text>
                <Pressable
                  onPress={() => setIsCalendarModalOpen(true)}
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.dataInicio
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                >
                  <Text
                    className={`
                    ${
                      (getFieldMeta("dataInicio")?.value as string)
                        ? "text-white"
                        : "text-['rgb(156 163 175)']"
                    }
                    text-white  py-1 ${
                      errors.dataInicio
                        ? " text-red-800 font-normal"
                        : "font-semibold"
                    }}`}
                  >
                    {(getFieldMeta("dataInicio")?.value as string)
                      ? getFieldMeta("dataInicio")?.value.toString()
                      : "Choose date"}
                  </Text>
                </Pressable>
                <Modal
                  visible={isCalendarModalOpen}
                  onRequestClose={() => setIsCalendarModalOpen(false)}
                  animationType="fade"
                  transparent={true}
                  className="bg-black"
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setIsCalendarModalOpen(false);
                    }}
                  >
                    <View className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                      <Calendar
                        onDayPress={(day) => {
                          setFieldValue("dataInicio", day.dateString);
                          setSelected(day.dateString);
                          setIsCalendarModalOpen(false);
                        }}
                        markedDates={{
                          "2024-01-22": {
                            selected: true,
                            marked: true,
                            disableTouchEvent: true,
                            selectedColor: "gray",
                          },
                          [selected]: { selected: true, selectedColor: "blue" },
                        }}
                        minDate={today.toDateString()}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
              </View>
              <View className="flex flex-col gap-2 text-black">
                <Text className="font-semibold text-custom-gray text-[14px]">
                  Horario Inicio :
                </Text>
                <Pressable
                  onPress={() => setIsHorarioInicioModalOpen(true)}
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.horarioInicio
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                >
                  <Text
                    className={`text-white  py-1 ${
                      errors.horarioInicio
                        ? " text-red-800 font-normal"
                        : "text-white font-semibold"
                    }}`}
                  >
                    {(getFieldMeta("horarioInicio")?.value as string)
                      ? getFieldMeta("horarioInicio")?.value.toString()
                      : "Choose Hour"}
                  </Text>
                </Pressable>
                <Modal
                  visible={isHorarioInicioModalOpen}
                  onRequestClose={() => setIsHorarioInicioModalOpen(false)}
                  animationType="fade"
                  transparent={true}
                  className="bg-black"
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setIsHorarioInicioModalOpen(false);
                    }}
                  >
                    <View className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                      <DateTimePicker
                        value={inicioDate}
                        mode="time"
                        onChange={(date, r) => {
                          setInicioDate(r);
                          setFieldValue(
                            "horarioInicio",
                            r.toTimeString().split(" ")[0]
                          );
                          setIsHorarioInicioModalOpen(false);
                        }}
                        is24Hour={true}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
                {errors?.horarioInicio &&
                  errors?.horarioInicio.toString() != "Required" && (
                    <Text className="text-red-700 font-semibold">
                      {errors.horarioInicio.toString()}
                    </Text>
                  )}
              </View>
              <View className="flex flex-col gap-2 text-black">
                <Text className="font-semibold text-custom-gray text-[14px]">
                  Horario Fim :
                </Text>
                <Pressable
                  onPress={() => setIsHorarioFimModalOpen(true)}
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.horarioFim
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                >
                  <Text
                    className={`text-white  py-1 ${
                      errors.horarioFim
                        ? " text-red-800 font-normal"
                        : "text-white font-semibold"
                    }}`}
                  >
                    {(getFieldMeta("horarioFim")?.value as string)
                      ? getFieldMeta("horarioFim")?.value.toString()
                      : "Choose Hour"}
                  </Text>
                </Pressable>
                <Modal
                  visible={isHorarioFimModalOpen}
                  onRequestClose={() => setIsHorarioFimModalOpen(false)}
                  animationType="fade"
                  transparent={true}
                  className="bg-black"
                >
                  <TouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setIsHorarioFimModalOpen(false);
                    }}
                  >
                    <View className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                      <DateTimePicker
                        value={inicioDate}
                        mode="time"
                        onChange={(date, r) => {
                          setInicioDate(r);
                          setFieldValue(
                            "horarioFim",
                            r.toTimeString().split(" ")[0]
                          );
                          setIsHorarioFimModalOpen(false);
                        }}
                        is24Hour={true}
                      />
                    </View>
                  </TouchableOpacity>
                </Modal>
                {errors?.horarioFim &&
                  errors?.horarioFim.toString() != "Required" && (
                    <Text className="text-red-700 font-semibold">
                      {errors.horarioFim.toString()}
                    </Text>
                  )}
              </View>
            </View>
            <View className="flex flex-col gap-y-2 mt-3">
              <Text className="text-custom-gray text-[14px] font-semibold">
                Convidados
              </Text>
              <TextInput
                onChangeText={handleChange("convidados")}
                onChange={(event) => {
                  if (Number(event.nativeEvent.text) >= 30) {
                    setFieldValue("limpeza", true);
                    setFieldValue("recepcionista", true);
                  }
                  if (Number(event.nativeEvent.text) >= 70) {
                    setFieldValue("seguranca", true);
                  }
                }}
                onBlur={handleBlur("convidados")}
                value={values.convidados}
                keyboardType="numeric"
                placeholder={
                  errors.convidados
                    ? errors.convidados.toString()
                    : "Type the convidados"
                }
                placeholderTextColor={
                  errors.convidados ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.convidados
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
              />
              {errors?.convidados &&
                errors?.convidados.toString() != "Required" && (
                  <Text className="text-red-700 font-semibold">
                    {errors.convidados.toString()}
                  </Text>
                )}
            </View>
            <View className="mt-4 space-y-2">
              <Text className="text-custom-gray text-[14px] font-semibold">
                Descricao:
              </Text>
              <TextInput
                multiline
                numberOfLines={4} // Defina o número desejado de linhas visíveis
                onChangeText={handleChange("texto")}
                onBlur={handleBlur("email")}
                value={values.texto}
                textAlignVertical="top"
                placeholder={
                  errors.texto
                    ? errors.texto.toString()
                    : "Type the description"
                }
                placeholderTextColor={
                  errors.texto ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-2 text-white ${
                  errors.texto
                    ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                    : "bg-gray-ligth"
                }`}
              />
              {errors?.texto && errors?.texto.toString() != "Required" && (
                <Text className="text-red-700 font-semibold">
                  {errors.texto.toString()}
                </Text>
              )}
            </View>
            <View className="mt-4 space-y-2">
              <Text className="text-custom-gray text-[14px] font-semibold">
                Extras:
              </Text>
              <View className="w-full flex flex-row justify-start items-center">
                <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <Pressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      if (Number(getFieldMeta("convidados")?.value) < 30) {
                        setFieldValue(
                          "recepcionista",
                          !getFieldMeta("recepcionista")?.value
                        );
                      }
                    }}
                  >
                    <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("recepcionista").value === true && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text className="text-custom-gray text-[14px] font-semibold">
                      Recepcionista
                    </Text>
                  </Pressable>
                </View>
                <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <Pressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      if (Number(getFieldMeta("convidados")?.value) < 70) {
                        setFieldValue(
                          "seguranca",
                          !getFieldMeta("seguranca")?.value
                        );
                      }
                    }}
                  >
                    <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("seguranca").value === true && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text className="text-custom-gray text-[14px] font-semibold">
                      Seguranca
                    </Text>
                  </Pressable>
                </View>
                <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <Pressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      if (Number(getFieldMeta("convidados")?.value) < 30) {
                        setFieldValue(
                          "limpeza",
                          !getFieldMeta("limpeza")?.value
                        );
                      }
                    }}
                  >
                    <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("limpeza").value === true && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text className="text-custom-gray text-[14px] font-semibold">
                      Limpeza
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <View
              className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
            >
              <Text className="font-semibold text-custom-gray text-[14px]">
                Ja conhece o espaco?
              </Text>
              <View className="flex flex-row pt-3 gap-x-1">
                <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <Pressable
                    className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                    onPress={() => {
                      setFieldValue("conheceEspaco", true);
                    }}
                  >
                    <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("conheceEspaco").value === true && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text className="text-custom-gray text-[14px] font-semibold">
                      Sim
                    </Text>
                  </Pressable>
                </View>
                <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <Pressable
                    className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                    onPress={() => {
                      setFieldValue("conheceEspaco", false);
                    }}
                  >
                    <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("conheceEspaco").value === false && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text className="text-custom-gray text-[14px] font-semibold">
                      Nao
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <View
              className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
            >
              <Text className="font-semibold text-custom-gray text-[14px]">
                Onde nos achou?
              </Text>
              <View className="flex flex-row pt-3 ">
                <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <Pressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafegoCanal", "Instagram");
                    }}
                  >
                    <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "Instagram" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text className="text-custom-gray text-[14px] font-semibold">
                      Instagram
                    </Text>
                  </Pressable>
                </View>
                <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <Pressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafegoCanal", "TiTok");
                    }}
                  >
                    <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "TiTok" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text className="text-custom-gray text-[14px] font-semibold">
                      TiTok
                    </Text>
                  </Pressable>
                </View>
                <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <Pressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafegoCanal", "Amigos");
                    }}
                  >
                    <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "Amigos" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text className="text-custom-gray text-[14px] font-semibold">
                      Amigos
                    </Text>
                  </Pressable>
                </View>
                <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <Pressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafegoCanal", "Outros");
                    }}
                  >
                    <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "Outros" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </View>
                    <Text className="text-custom-gray text-[14px] font-semibold">
                      Outros
                    </Text>
                  </Pressable>
                </View>
              </View>
            </View>
            <Pressable
              onPress={() => handleSubmit()}
              className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
            >
              <Text className="font-bold text-custom-white">
                {budget ? "UPDATE" : "CREATE"}
              </Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}

/* if (!budget) {
  const newOrcamento = await dispatch(
    createOrcamentoValueAsync({
      aprovadoAr756: values?.aprovadoAr756,
      aprovadoCliente: values?.aprovadoCliente,
      conheceEspaco: values?.conheceEspaco,
      contato: values?.contato,
      convidados: values?.convidados,
      dataFim: values?.dataFim,
      dataInicio: values?.dataInicio,
      email: values?.email,
      feedback: values?.feedback,
      limpeza: values?.limpeza,
      nome: values?.nome,
      qtdHorasExtras: values?.qtdHorasExtras,
      recepcionista: values?.recepcionista,
      seguranca: values?.seguranca,
      telefone: values?.telefone,
      texto: values?.texto,
      total: values?.total,
      trafegoCanal: values?.trafegoCanal,
      valorBase: values?.valorBase,
      valorHoraExtra: values?.valorHoraExtra,
    })
  );

  if (newOrcamento.meta.requestStatus == "fulfilled") {
    Toast.show("Text created successfully." as string, 3000, {
      backgroundColor: "rgb(75,181,67)",
      textColor: "white",
    });
  }

  if (newOrcamento.meta.requestStatus == "rejected") {
    Toast.show(error as string, 3000, {
      backgroundColor: "#FF9494",
      textColor: "white",
    });
  }
} else {
  const updatedText = await dispatch(
    updateOrcamentoByIdAsync({
      orcamentoId: budget.id,
      data: {
        aprovadoAr756: values?.aprovadoAr756,
        aprovadoCliente: values?.aprovadoCliente,
        conheceEspaco: values?.conheceEspaco,
        contato: values?.contato,
        convidados: values?.convidados,
        dataFim: values?.dataFim,
        dataInicio: values?.dataInicio,
        email: values?.email,
        feedback: values?.feedback,
        limpeza: values?.limpeza,
        nome: values?.nome,
        qtdHorasExtras: values?.qtdHorasExtras,
        recepcionista: values?.recepcionista,
        seguranca: values?.seguranca,
        telefone: values?.telefone,
        texto: values?.texto,
        total: values?.total,
        trafegoCanal: values?.trafegoCanal,
        valorBase: values?.valorBase,
        valorHoraExtra: values?.valorHoraExtra,
      },
    })
  );

  if (updatedText.meta.requestStatus == "fulfilled") {
    Toast.show("Text updated successfully." as string, 3000, {
      backgroundColor: "rgb(75,181,67)",
      textColor: "white",
    });
  }

  if (updatedText.meta.requestStatus == "rejected") {
    Toast.show(error as string, 3000, {
      backgroundColor: "#FF9494",
      textColor: "white",
    });
  }
} */
