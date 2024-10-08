import moment from "moment";
import { Formik } from "formik";
import { format } from "date-fns";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import Toast from "react-native-simple-toast";
import { Calendar } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import DateTimePicker from "@react-native-community/datetimepicker";

import { BugdetType } from "type";
import { calcTotal } from "function/calcTotal";
import { AppDispatch, RootState } from "@store/index";
import { fecthValues } from "@store/value/valuesSlice";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createOrcamentoFormSchema } from "@schemas/createOrcamentoFormZodSchema";
import {
  createOrcamentoValueAsync,
  updateOrcamentoByIdAsync,
} from "@store/budget/bugetSlice";
import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";
import { formatCurrency } from "react-native-format-currency";
import { transformDate } from "function/transformData";
import { calcNovoTotal } from "function/calcNovoTotal";
import { Pressable, Text } from "react-native";

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

  const [selected, setSelected] = useState<any>();
  const [inicioDate, setInicioDate] = useState(new Date());
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isHorarioFimModalOpen, setIsHorarioFimModalOpen] = useState(false);
  const [isHorarioInicioModalOpen, setIsHorarioInicioModalOpen] =
    useState(false);

  return (
    <StyledScrollView>
      <Formik
        validationSchema={toFormikValidationSchema<any>(
          createOrcamentoFormSchema
        )}
        initialValues={{
          nome: budget?.nome && budget?.nome,
          email: budget?.email && budget?.email,
          texto: budget?.texto && budget?.texto,
          limpeza: budget?.limpeza && budget?.limpeza,
          telefone: budget?.telefone && budget?.telefone,
          seguranca: budget?.seguranca && budget?.seguranca,
          total: budget?.total && String(budget?.total.toFixed(0)),
          trafegoCanal: budget?.trafegoCanal && budget?.trafegoCanal,
          recepcionista: budget?.recepcionista && budget?.recepcionista,
          conheceEspaco: budget?.conheceEspaco && budget?.conheceEspaco,
          convidados: budget?.convidados && budget?.convidados?.toString(),
          dataInicio:
            budget?.dataInicio && format(budget?.dataInicio, "dd/MM/yyyy"),
          horarioFim:
            budget?.dataFim && moment.utc(budget?.dataFim).format("HH:mm"),
          horarioInicio:
            budget?.dataInicio &&
            moment.utc(budget?.dataInicio).format("HH:mm"),
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
          if (budget) {
            if (budget?.total?.toFixed(0) === values?.total) {
              const { dataFim, dataInicial } = transformDate({
                separador: "/",
                dataInicio: values?.dataInicio,
                horarioFim: values?.horarioFim,
                horarioInicio: values?.horarioInicio,
              });

              const final = new Date(dataFim.toDate());
              const inicial = new Date(dataInicial.toDate());

              const updatedOrcamento = await dispatch(
                updateOrcamentoByIdAsync({
                  orcamentoId: budget.id,
                  data: {
                    nome: values?.nome,
                    email: values?.email,
                    texto: values?.texto,
                    telefone: values?.telefone,
                    dataFim: final?.toISOString(),
                    limpeza: values?.limpeza || false,
                    dataInicio: inicial?.toISOString(),
                    trafegoCanal: values?.trafegoCanal,
                    conheceEspaco: values?.conheceEspaco,
                    seguranca: values?.seguranca || false,
                    convidados: Number(values?.convidados),
                    recepcionista: values?.recepcionista || false,
                  },
                })
              );
              if (updatedOrcamento.meta.requestStatus == "fulfilled") {
                Toast.show(
                  "Orcamento atualizado com sucesso." as string,
                  3000,
                  {
                    backgroundColor: "rgb(75,181,67)",
                    textColor: "white",
                  }
                );
              }

              if (updatedOrcamento.meta.requestStatus == "rejected") {
                Toast.show(error as string, 3000, {
                  backgroundColor: "#FF9494",
                  textColor: "white",
                });
              }

              return;
            }

            const {
              final,
              diaria,
              inicial,
              novoTotal,
              qtdHorasExtras,
              valorHoraExtra,
            } = calcNovoTotal({
              data: { valueList: valueList.values, ...values },
              separador: "/",
            });

            const updatedOrcamento = await dispatch(
              updateOrcamentoByIdAsync({
                orcamentoId: budget.id,
                data: {
                  feedback: "",
                  tipo: "Festa",
                  contato: false,
                  total: novoTotal,
                  valorBase: diaria,
                  nome: values?.nome,
                  email: values?.email,
                  texto: values?.texto,
                  telefone: values?.telefone,
                  dataFim: final?.toISOString(),
                  qtdHorasExtras: qtdHorasExtras,
                  limpeza: values?.limpeza || false,
                  dataInicio: inicial?.toISOString(),
                  trafegoCanal: values?.trafegoCanal,
                  aprovadoAr756: budget.aprovadoAr756,
                  conheceEspaco: values?.conheceEspaco,
                  seguranca: values?.seguranca || false,
                  convidados: Number(values?.convidados),
                  aprovadoCliente: budget.aprovadoCliente,
                  recepcionista: values?.recepcionista || false,
                  valorHoraExtra: values?.total
                    ? Number(values?.total / 7)
                    : valorHoraExtra,
                },
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
          } else {
            if (values.total) {
              const {
                final,
                diaria,
                inicial,
                novoTotal,
                qtdHorasExtras,
                valorHoraExtra,
              } = calcNovoTotal({
                data: { valueList: valueList.values, ...values },
                separador: "/",
              });

              const newOrcamento = await dispatch(
                createOrcamentoValueAsync({
                  feedback: "",
                  tipo: "Festa",
                  contato: false,
                  total: novoTotal,
                  valorBase: diaria,
                  nome: values?.nome,
                  aprovadoAr756: false,
                  email: values?.email,
                  texto: values?.texto,
                  aprovadoCliente: false,
                  telefone: values?.telefone,
                  dataFim: final?.toISOString(),
                  qtdHorasExtras: qtdHorasExtras,
                  valorHoraExtra: valorHoraExtra,
                  limpeza: values?.limpeza || false,
                  dataInicio: inicial?.toISOString(),
                  trafegoCanal: values?.trafegoCanal,
                  conheceEspaco: values?.conheceEspaco,
                  seguranca: values?.seguranca || false,
                  convidados: Number(values?.convidados),
                  recepcionista: values?.recepcionista || false,
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

              return;
            }

            const {
              final,
              inicial,
              qtdHorasExtras,
              total,
              valorHoraExtra,
              diaria,
            } = calcTotal({ data: { valueList: valueList.values, ...values } });

            const newOrcamento = await dispatch(
              createOrcamentoValueAsync({
                feedback: "",
                tipo: "Festa",
                contato: false,
                valorBase: diaria,
                nome: values?.nome,
                aprovadoAr756: false,
                email: values?.email,
                texto: values?.texto,
                aprovadoCliente: false,
                telefone: values?.telefone,
                dataFim: final?.toISOString(),
                qtdHorasExtras: qtdHorasExtras,
                valorHoraExtra: valorHoraExtra,
                limpeza: values?.limpeza || false,
                dataInicio: inicial?.toISOString(),
                trafegoCanal: values?.trafegoCanal,
                conheceEspaco: values?.conheceEspaco,
                total: Number(values?.total) || total,
                seguranca: values?.seguranca || false,
                convidados: Number(values?.convidados),
                recepcionista: values?.recepcionista || false,
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
          <StyledView className="w-[90%] mx-auto my-5 flex flex-col">
            <StyledView className="flex flex-col gap-y-3">
              <StyledView className="flex flex-col gap-y-2">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Nome
                </StyledText>
                <StyledTextInput
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.nome
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                  onChangeText={handleChange("nome")}
                  onBlur={handleBlur("nome")}
                  value={values.nome}
                />
                {errors?.nome && errors?.nome.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.nome?.toString()}
                  </StyledText>
                )}
              </StyledView>
              <StyledView className="flex flex-col gap-y-2">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Email
                </StyledText>
                <StyledTextInput
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.email
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                  onChangeText={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                />
                {errors?.email && errors?.email.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.email?.toString()}
                  </StyledText>
                )}
              </StyledView>
              <StyledView className="flex flex-col gap-y-2">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Telefone
                </StyledText>
                <StyledTextInputMask
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
                    <StyledText className="text-red-700 font-semibold">
                      {errors.telefone?.toString()}
                    </StyledText>
                  )}
              </StyledView>
              <StyledView className="flex flex-col gap-2">
                <StyledText className="font-semibold text-custom-gray text-[14px]">
                  Data do evento :
                </StyledText>
                <StyledPressable
                  onPress={() => setIsCalendarModalOpen(true)}
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.dataInicio
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                >
                  <StyledText
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
                      ? getFieldMeta("dataInicio")?.value?.toString()
                      : "Choose date"}
                  </StyledText>
                </StyledPressable>
                <StyledModal
                  visible={isCalendarModalOpen}
                  onRequestClose={() => setIsCalendarModalOpen(false)}
                  animationType="fade"
                  transparent={true}
                  className="bg-black"
                >
                  <StyledTouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setIsCalendarModalOpen(false);
                    }}
                  >
                    <StyledView className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                      <Calendar
                        onDayPress={(day) => {
                          setFieldValue(
                            "dataInicio",
                            format(day.dateString, "dd/MM/yyyy")
                          );
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
                        minDate={today?.toDateString()}
                      />
                    </StyledView>
                  </StyledTouchableOpacity>
                </StyledModal>
              </StyledView>
              <StyledView className="flex flex-col gap-2 text-black">
                <StyledText className="font-semibold text-custom-gray text-[14px]">
                  Horario Inicio :
                </StyledText>
                <StyledPressable
                  onPress={() => setIsHorarioInicioModalOpen(true)}
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.horarioInicio
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                >
                  <StyledText
                    className={`text-white  py-1 ${
                      errors.horarioInicio
                        ? " text-red-800 font-normal"
                        : "text-white font-semibold"
                    }}`}
                  >
                    {(getFieldMeta("horarioInicio")?.value as string)
                      ? getFieldMeta("horarioInicio")?.value?.toString()
                      : "Choose Hour"}
                  </StyledText>
                </StyledPressable>
                <StyledModal
                  visible={isHorarioInicioModalOpen}
                  onRequestClose={() => setIsHorarioInicioModalOpen(false)}
                  animationType="fade"
                  transparent={true}
                  className="bg-black"
                >
                  <StyledTouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setIsHorarioInicioModalOpen(false);
                    }}
                  >
                    <StyledView className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
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
                    </StyledView>
                  </StyledTouchableOpacity>
                </StyledModal>
                {errors?.horarioInicio &&
                  errors?.horarioInicio.toString() != "Required" && (
                    <StyledText className="text-red-700 font-semibold">
                      {errors.horarioInicio?.toString()}
                    </StyledText>
                  )}
              </StyledView>
              <StyledView className="flex flex-col gap-2 text-black">
                <StyledText className="font-semibold text-custom-gray text-[14px]">
                  Horario Fim :
                </StyledText>
                <StyledPressable
                  onPress={() => setIsHorarioFimModalOpen(true)}
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.horarioFim
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                >
                  <StyledText
                    className={`text-white  py-1 ${
                      errors.horarioFim
                        ? " text-red-800 font-normal"
                        : "text-white font-semibold"
                    }}`}
                  >
                    {(getFieldMeta("horarioFim")?.value as string)
                      ? getFieldMeta("horarioFim")?.value?.toString()
                      : "Choose Hour"}
                  </StyledText>
                </StyledPressable>
                <StyledModal
                  visible={isHorarioFimModalOpen}
                  onRequestClose={() => setIsHorarioFimModalOpen(false)}
                  animationType="fade"
                  transparent={true}
                  className="bg-black"
                >
                  <StyledTouchableOpacity
                    style={{ flex: 1 }}
                    onPress={() => {
                      setIsHorarioFimModalOpen(false);
                    }}
                  >
                    <StyledView className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                      <DateTimePicker
                        value={inicioDate}
                        mode="time"
                        onChange={(date, r) => {
                          setInicioDate(r);
                          setFieldValue(
                            "horarioFim",
                            r.toTimeString()?.split(" ")[0]
                          );
                          setIsHorarioFimModalOpen(false);
                        }}
                        is24Hour={true}
                      />
                    </StyledView>
                  </StyledTouchableOpacity>
                </StyledModal>
                {errors?.horarioFim &&
                  errors?.horarioFim.toString() != "Required" && (
                    <StyledText className="text-red-700 font-semibold">
                      {errors.horarioFim?.toString()}
                    </StyledText>
                  )}
              </StyledView>
            </StyledView>
            <StyledView className="flex flex-col gap-y-2 mt-3">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Convidados
              </StyledText>
              <StyledTextInput
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
                    ? errors.convidados?.toString()
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
                  <StyledText className="text-red-700 font-semibold">
                    {errors.convidados?.toString()}
                  </StyledText>
                )}
              <StyledView className="flex flex-col gap-y-2 mt-3">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Valor
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("total")}
                  onBlur={handleBlur("total")}
                  value={values?.total?.toString()}
                  keyboardType="numeric"
                  placeholder={
                    errors.total ? errors.total?.toString() : "Type the total"
                  }
                  placeholderTextColor={
                    errors.total ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.total
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                />
                {errors?.total && errors?.total?.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.total?.toString()}
                  </StyledText>
                )}
              </StyledView>
            </StyledView>
            <StyledView className="mt-4 space-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Descricao:
              </StyledText>
              <StyledTextInput
                multiline
                numberOfLines={4} // Defina o número desejado de linhas visíveis
                onChangeText={handleChange("texto")}
                onBlur={handleBlur("texto")}
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
              {errors?.texto && errors?.texto?.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.texto?.toString()}
                </StyledText>
              )}
            </StyledView>
            <StyledView className="mt-4 space-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Extras:
              </StyledText>
              <StyledView className="w-full flex flex-row justify-start items-center">
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
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
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("recepcionista").value === true && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Recepcionista
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
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
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("seguranca").value === true && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Seguranca
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
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
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("limpeza").value === true && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Limpeza
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledView>
            </StyledView>
            <StyledView
              className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
            >
              <StyledText className="font-semibold text-custom-gray text-[14px]">
                Ja conhece o espaco?
              </StyledText>
              <StyledView className="flex flex-row pt-3 gap-x-1">
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                    onPress={() => {
                      setFieldValue("conheceEspaco", true);
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("conheceEspaco").value === true && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Sim
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                    onPress={() => {
                      setFieldValue("conheceEspaco", false);
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("conheceEspaco").value === false && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Nao
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledView>
            </StyledView>
            <StyledView
              className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
            >
              <StyledText className="font-semibold text-custom-gray text-[14px]">
                Onde nos achou?
              </StyledText>
              <StyledView className="flex flex-row pt-3 ">
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafegoCanal", "Instagram");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "Instagram" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Instagram
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafegoCanal", "TiTok");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "TiTok" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      TiTok
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafegoCanal", "Amigos");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "Amigos" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Amigos
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafegoCanal", "Outros");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "Outros" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Outros
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledView>
            </StyledView>
            <StyledPressable
              onPress={() => handleSubmit()}
              className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
            >
              <StyledText className="font-bold text-custom-white">
                {budget ? "UPDATE" : "CREATE"}
              </StyledText>
            </StyledPressable>
          </StyledView>
        )}
      </Formik>
    </StyledScrollView>
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
