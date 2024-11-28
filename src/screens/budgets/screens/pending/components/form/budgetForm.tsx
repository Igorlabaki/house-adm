import moment from "moment";
import { Formik } from "formik";
import { format } from "date-fns";
import { Entypo } from "@expo/vector-icons";
import { useState } from "react";
import Toast from "react-native-simple-toast";
import { Calendar } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import { BugdetType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { createOrcamentoFormSchema } from "@schemas/createOrcamentoFormZodSchema";
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
import { CreateOrcamentoFormData } from "zod/types/createOrcamentoFormZodType";
import { fetchNotificacoes } from "function/fetchNotifications";
import { createOrcamentoValueAsync, updateOrcamentoByIdAsync } from "@store/budget/bugetSlice";
import { fetchOrcamentoById } from "@store/orcamento/orcamentoSlice";
import { fetchNotificationsList } from "@store/notifications/notificationsSlice";

interface BugdetFormProps {
  orcamento?: BugdetType;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BudgetForm({ setIsEditModalOpen,orcamento }: BugdetFormProps) {

  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.orcamentosList
  );
  const today = new Date();
  const [selected, setSelected] = useState<any>();
  const [isLoading, setIsLoding] = useState(false);
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  return (
    <StyledView className="bg-gray-dark">
      <Formik
        validationSchema={toFormikValidationSchema<any>(
          createOrcamentoFormSchema
        )}
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={{
          nome: orcamento?.nome && orcamento?.nome,
          email: orcamento?.email && orcamento?.email,
          texto: orcamento?.texto && orcamento?.texto,
          tipo: orcamento?.tipo && orcamento?.tipo,
          telefone: orcamento?.telefone && orcamento?.telefone,
          valorPago: orcamento?.valorPago?.toFixed(2).toString()
            ? orcamento?.valorPago.toFixed(2).toString()
            : "0",
          limpeza: orcamento?.limpeza ? orcamento?.limpeza : false,
          total: orcamento?.total ? orcamento?.total?.toFixed(2).toString() : "0",
          seguranca: orcamento?.seguranca ? orcamento?.seguranca : false,
          trafegoCanal: orcamento?.trafegoCanal && orcamento?.trafegoCanal,
          conheceEspaco: orcamento?.conheceEspaco && orcamento?.conheceEspaco,
          recepcionista: orcamento?.recepcionista ? orcamento?.recepcionista : false,
          convidados:
            orcamento?.convidados !== undefined
              ? orcamento.convidados.toString()
              : "0",
          data: orcamento?.dataInicio && format(orcamento?.dataInicio, "dd/MM/yyyy"),
          horarioFim:
            orcamento?.dataFim && moment.utc(orcamento?.dataFim).format("HH:mm"),
          horarioInicio:
            orcamento?.dataInicio &&
            moment.utc(orcamento?.dataInicio).format("HH:mm"),
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
        onSubmit={async (values: CreateOrcamentoFormData) => {
          setIsLoding(true)
          if (orcamento) {
            const updatedOrcamento = await dispatch(
              updateOrcamentoByIdAsync({
                data: {
                  ...values,
                  total: values?.total.includes("R$") ? values?.total
                  .replace("R$", "")
                  .replace(/\./g, "")
                  .replace(",", ".") : values?.total,
                valorPago: values?.valorPago.includes("R$") ?  values?.valorPago
                  .replace("R$", "")
                  .replace(/\./g, "")
                  .replace(",", "."): values?.valorPago,
                },
                orcamentoId: orcamento.id,
              })
            );

            if (updatedOrcamento.meta.requestStatus == "fulfilled") {
              dispatch(fetchOrcamentoById(orcamento?.id))
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
            setIsEditModalOpen(false);
            setIsLoding(false);
            return;
          }

          const { valorPago, ...rest } = values;

          const newOrcamento = await dispatch(
            createOrcamentoValueAsync({
              ...rest,
              total: Number(
                values?.total
                  .replace("R$", "")
                  .replace(/\./g, "")
                  .replace(",", ".")
              ),
              convidados: Number(values.convidados),
            })
          );

          if (newOrcamento.meta.requestStatus == "fulfilled") {
            dispatch(fetchNotificationsList())
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
          setIsEditModalOpen(false);
          setIsLoding(false);
          return;
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
                  onFocus={(e) => e.stopPropagation()}
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white z-50 ${
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
                  onFocus={(e) => e.stopPropagation()}
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
                  onFocus={(e) => e.stopPropagation()}
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
                    errors.data
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                >
                  <StyledText
                    className={`
                    ${
                      (getFieldMeta("data")?.value as string)
                        ? "text-white"
                        : "text-['rgb(156 163 175)']"
                    }
                    text-white  py-1 ${
                      errors.data
                        ? " text-red-800 font-normal"
                        : "font-semibold"
                    }}`}
                  >
                    {(getFieldMeta("data")?.value as string)
                      ? getFieldMeta("data")?.value?.toString()
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
                            "data",
                            moment.utc(day.dateString).format("DD/MM/yyyy")
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
                      />
                    </StyledView>
                  </StyledTouchableOpacity>
                </StyledModal>
              </StyledView>

              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Horario Inicio
                </StyledText>
                <StyledTextInputMask
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.horarioInicio
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                  type={"custom"}
                  options={{
                    mask: "99:99", // Máscara para HH:MM
                  }}
                  onChangeText={(formatted, extracted) => {
                    handleChange("horarioInicio")(formatted); // Usa o texto formatado no formato HH:MM
                  }}
                  onBlur={handleBlur("horarioInicio")}
                  value={String(values?.horarioInicio)}
                  placeholder={
                    errors.horarioInicio
                      ? String(errors.horarioInicio)
                      : "Digite o horário de início"
                  }
                  placeholderTextColor={
                    errors.horarioInicio ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  keyboardType="numeric" // Define o teclado numéri
                />
                {errors?.horarioInicio &&
                  errors?.horarioInicio.toString() != "Required" && (
                    <StyledText className="text-red-700 font-semibold">
                      {errors.horarioInicio?.toString()}
                    </StyledText>
                  )}
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Horario Fim
                </StyledText>
                <StyledTextInputMask
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.horarioFim
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                  type={"custom"}
                  options={{
                    mask: "99:99", // Máscara para HH:MM
                  }}
                  onChangeText={(formatted, extracted) => {
                    handleChange("horarioFim")(formatted); // Usa o texto formatado no formato HH:MM
                  }}
                  onBlur={handleBlur("horarioFim")}
                  value={String(values?.horarioFim)}
                  placeholder={
                    errors.horarioFim
                      ? String(errors.horarioFim)
                      : "Digite o horário de início"
                  }
                  placeholderTextColor={
                    errors.horarioFim ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  keyboardType="numeric" // Define o teclado numéri
                />
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
                onFocus={(e) => e.stopPropagation()}
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
                value={values?.convidados.toString()}
                keyboardType="numeric"
                placeholder={
                  errors?.convidados
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
                    {errors?.convidados?.toString()}
                  </StyledText>
                )}
              <StyledView className="flex flex-col gap-y-2">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Total
                </StyledText>
                <StyledTextInputMask
                  onFocus={(e) => e.stopPropagation()}
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.total
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                  type="money"
                  options={{
                    maskType: "BRL",
                  }}
                  onChangeText={handleChange("total")}
                  onBlur={handleBlur("total")}
                  value={values.total}
                />
                {errors?.total && errors?.total.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.total?.toString()}
                  </StyledText>
                )}
              </StyledView>
{/*               {orcamento && (
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Valor Pago
                  </StyledText>
                  <StyledTextInputMask
                    onFocus={(e) => e.stopPropagation()}
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                      errors.valorPago
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                    type="money"
                    options={{
                      maskType: "BRL",
                    }}
                    onChangeText={handleChange("valorPago")}
                    onBlur={handleBlur("valorPago")}
                    value={values.valorPago}
                  />
                  {errors?.valorPago &&
                    errors?.valorPago.toString() != "Required" && (
                      <StyledText className="text-red-700 font-semibold">
                        {errors.valorPago?.toString()}
                      </StyledText>
                    )}
                </StyledView>
              )} */}
            </StyledView>
            <StyledView className="mt-4 space-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Descricao:
              </StyledText>
              <StyledTextInput
                onFocus={(e) => e.stopPropagation()}
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
                Tipo do aluguel:
              </StyledText>
              <StyledView className="flex flex-row pt-3 ">
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("tipo", "Filmagem");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("tipo").value === "Filmagem" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Filmagem
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("tipo", "Festa");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("tipo").value === "Festa" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Festa
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("tipo", "Outro");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("tipo").value === "Outro" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Outro
                    </StyledText>
                  </StyledPressable>
                </StyledView>
              </StyledView>
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
                Onde nos achou?
              </StyledText>
              <StyledView className="flex flex-row pt-3 flex-wrap gap-y-1">
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
                      setFieldValue("trafegoCanal", "Facebook");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "Facebook" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Facebook
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafegoCanal", "Airbnb");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "Airbnb" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Airbnb
                    </StyledText>
                  </StyledPressable>
                </StyledView>
                <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                  <StyledPressable
                    className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                    onPress={() => {
                      setFieldValue("trafegoCanal", "Google");
                    }}
                  >
                    <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                      {getFieldMeta("trafegoCanal").value === "Google" && (
                        <Entypo name="check" size={12} color="white" />
                      )}
                    </StyledView>
                    <StyledText className="text-custom-gray text-[14px] font-semibold">
                      Google
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
              disabled={isLoading ? true : false}
              onPress={() => {
                handleSubmit();
              }}
              className={`bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md`}
            >
              <StyledText className="font-bold text-custom-white">
                {isLoading ? "Enviando" : orcamento ? "Atualizar" : "Criar"}
              </StyledText>
            </StyledPressable>
          </StyledView>
        )}
      </Formik>
    </StyledView>
  );
}

/* if (!orcamento) {
  const newOrcamento = await dispatch(
    createOrcamentoValueAsync({
      aprovadoAr756: values?.aprovadoAr756,
      aprovadoCliente: values?.aprovadoCliente,
      conheceEspaco: values?.conheceEspaco,
      contato: values?.contato,
      convidados: values?.convidados,
      dataFim: values?.dataFim,
      data: values?.data,
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
      orcamentoId: orcamento.id,
      data: {
        aprovadoAr756: values?.aprovadoAr756,
        aprovadoCliente: values?.aprovadoCliente,
        conheceEspaco: values?.conheceEspaco,
        contato: values?.contato,
        convidados: values?.convidados,
        dataFim: values?.dataFim,
        data: values?.data,
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

/*   if (orcamento) {
    if (orcamento?.total?.toFixed(0) === values?.total) {
      const { dataFim, dataInicial } = transformDate({
        separador: "/",
        data: values?.data,
        horarioFim: values?.horarioFim,
        horarioInicio: values?.horarioInicio,
      });

      const final = new Date(dataFim.toDate());
      const inicial = new Date(dataInicial.toDate());

      const updatedOrcamento = await dispatch(
        updateOrcamentoByIdAsync({
          orcamentoId: orcamento.id,
          data: {
            nome: values?.nome,
            email: values?.email,
            texto: values?.texto,
            telefone: values?.telefone,
            dataFim: final?.toISOString(),
            limpeza: values?.limpeza || false,
            data: inicial?.toISOString(),
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
        orcamentoId: orcamento.id,
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
          data: inicial?.toISOString(),
          trafegoCanal: values?.trafegoCanal,
          aprovadoAr756: orcamento.aprovadoAr756,
          conheceEspaco: values?.conheceEspaco,
          seguranca: values?.seguranca || false,
          convidados: Number(values?.convidados),
          aprovadoCliente: orcamento.aprovadoCliente,
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
          data: inicial?.toISOString(),
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
        data: inicial?.toISOString(),
        trafegoCanal: values?.trafegoCanal,
        conheceEspaco: values?.conheceEspaco,
        total: Number(values?.total) || total,
        seguranca: values?.seguranca || false,
        convidados: Number(values?.convidados),
        recepcionista: values?.recepcionista || false,
      })
    );
    console.log(newOrcamento)

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
  } */
