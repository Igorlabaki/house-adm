import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { DespesaType } from "type";
import { AppDispatch, RootState } from "@store/index";

import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";
import { createDespesaFormSchema } from "@schemas/createDespesaFormZodSchema";
import {
  createDespesaAsync,
  updateDespesaByIdAsync,
} from "@store/despesa/despesaSlice";
import { Entypo } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { format } from "date-fns";
import moment from "moment";

interface despesaFormProps {
  despesa?: DespesaType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function DespesaForm({ despesa,setIsModalOpen }: despesaFormProps) {
  const [selected, setSelected] = useState<any>();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector<RootState>(
    (state: RootState) => state.despesaList.error
  );

  const tipo = ["Mensal", "Quinzenal", "Semanal", "Anual"];
  const categoria = ["Imposto", "Investimento", "Manutencao", "Trafego"];
  return (
    <Formik
      validationSchema={toFormikValidationSchema(createDespesaFormSchema)}
      initialValues={{
        id: despesa?.id && despesa.id,
        categoria: despesa?.categoria,
        tipo: despesa?.tipo || "Esporadico",
        valor: despesa?.valor && Number(despesa?.valor),
        descricao: despesa?.descricao && despesa.descricao,
        recorrente: despesa?.recorrente ? despesa.recorrente : false,
        dataPagamento:
          despesa?.dataPagamento &&
          format(despesa?.dataPagamento, "dd/MM/yyyy"),
      }}
      validateOnChange={false}
      validateOnBlur={false}
      validate={(values) => {
        try {
          createDespesaFormSchema.parse(values);
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
      onSubmit={async (values: DespesaType) => {
        const [dayInicio, monthInicio, yearInicio] =
          values.dataPagamento.split("/");
        const dataPagamento = new Date(
          `${yearInicio}-${monthInicio}-${dayInicio}`
        );

        if (!despesa) {
          const createDespesa = await dispatch(
            createDespesaAsync({
              tipo: values?.tipo,
              valor: Number(values.valor),
              descricao: values?.descricao,
              categoria: values?.categoria,
              recorrente: values?.recorrente,
              dataPagamento: dataPagamento.toISOString(),
            })
          );

          if (createDespesa.meta.requestStatus == "fulfilled") {
            Toast.show("Despesa criada com Sucesso." as string, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
          }

          if (createDespesa.meta.requestStatus == "rejected") {
            Toast.show(error as string, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }
        } else {
          const updateDespesa = await dispatch(
            updateDespesaByIdAsync({
              despesaId: despesa.id,
              data: {
                tipo: values?.tipo,
                valor: Number(values.valor),
                descricao: values?.descricao,
                categoria: values?.categoria,
                recorrente: values?.recorrente,
                dataPagamento: dataPagamento.toISOString(),
              },
            })
          );

          if (updateDespesa.meta.requestStatus == "fulfilled") {
            Toast.show("Despesa atualizada com sucesso." as string, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
          }

          if (updateDespesa.meta.requestStatus == "rejected") {
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
        getFieldMeta,
        setFieldValue,
        values,
        errors,
      }) => (
        <StyledView className="w-[90%] mx-auto my-5 flex flex-col">
          <StyledView className="flex flex-col gap-y-3">
            <StyledView className="flex flex-col gap-y-1">
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Titulo
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("descricao")}
                  onBlur={handleBlur("descricao")}
                  value={values.descricao}
                  placeholder={
                    errors.descricao ? errors.descricao : "Type the title"
                  }
                  placeholderTextColor={
                    errors.descricao ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.descricao
                      ? "bg-red-50  border-[2px] border-red-900"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-2 mt-3">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Valor
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("valor")}
                  onBlur={handleBlur("valor")}
                  value={values?.valor?.toString()}
                  keyboardType="numeric"
                  placeholder={
                    errors.valor ? errors.valor?.toString() : "Type the valor"
                  }
                  placeholderTextColor={
                    errors.valor ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.valor
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                />
                {errors?.valor && errors?.valor?.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.valor?.toString()}
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
                    errors.dataPagamento
                      ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                      : "bg-gray-ligth"
                  }`}
                >
                  <StyledText
                    className={`
                    ${
                      (getFieldMeta("dataPagamento")?.value as string)
                        ? "text-white"
                        : "text-['rgb(156 163 175)']"
                    }
                    text-white  py-1 ${
                      errors.dataPagamento
                        ? " text-red-800 font-normal"
                        : "font-semibold"
                    }}`}
                  >
                    {(getFieldMeta("dataPagamento")?.value as string)
                      ? getFieldMeta("dataPagamento")?.value?.toString()
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
                            "dataPagamento",
                            moment.utc(day.dateString).format('HH:mm')
                          );
                          setSelected(day.dateString);
                          setIsCalendarModalOpen(false);
                        }}
                      />
                    </StyledView>
                  </StyledTouchableOpacity>
                </StyledModal>
              </StyledView>
              <StyledView className="pt-3">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Recorrente:
                </StyledText>
                <StyledView className="flex justify-start items-start flex-row py-2 mt-1">
                  <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <StyledPressable
                      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                      onPress={() => {
                        setFieldValue("recorrente", true);
                      }}
                    >
                      <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("recorrente").value === true && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </StyledView>
                      <StyledText className="text-custom-gray  text-[13px] font-semibold">
                        Sim
                      </StyledText>
                    </StyledPressable>
                  </StyledView>
                  <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <StyledPressable
                      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                      onPress={() => {
                        setFieldValue("recorrente", false);
                      }}
                    >
                      <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("recorrente").value === false && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </StyledView>
                      <StyledText className="text-custom-gray  text-[13px] font-semibold">
                        Nao
                      </StyledText>
                    </StyledPressable>
                  </StyledView>
                </StyledView>
              </StyledView>
              {getFieldMeta("recorrente").value && (
                <StyledView className="py-3">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Tipo:
                  </StyledText>
                  <StyledView className="flex justify-start items-start flex-row py-2 mt-1">
                    {tipo.map((item: string, index) => {
                      return (
                        <StyledView
                          key={index}
                          className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]"
                        >
                          <StyledPressable
                            className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                            onPress={() => {
                              setFieldValue("tipo", item);
                            }}
                          >
                            <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                              {getFieldMeta("tipo").value === item && (
                                <Entypo name="check" size={12} color="white" />
                              )}
                            </StyledView>
                            <StyledText className="text-custom-gray  text-[13px] font-semibold">
                              {item}
                            </StyledText>
                          </StyledPressable>
                        </StyledView>
                      );
                    })}
                  </StyledView>
                </StyledView>
              )}
              <StyledView className="">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Categoria:
                </StyledText>
                <StyledView className="flex justify-start items-start flex-row py-2 flex-wrap gap-y-2 mt-1">
                  {categoria.map((item: string, index) => {
                    return (
                      <StyledView
                        key={index}
                        className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]"
                      >
                        <StyledPressable
                          className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                          onPress={() => {
                            setFieldValue("categoria", item);
                          }}
                        >
                          <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                            {getFieldMeta("categoria").value === item && (
                              <Entypo name="check" size={12} color="white" />
                            )}
                          </StyledView>
                          <StyledText className="text-custom-gray  text-[13px] font-semibold">
                            {item}
                          </StyledText>
                        </StyledPressable>
                      </StyledView>
                    );
                  })}
                </StyledView>
              </StyledView>
            </StyledView>
          </StyledView>
          <StyledPressable
            onPress={() => {
              handleSubmit()
              setIsModalOpen(false)
            }}
            className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
          >
            <StyledText className="font-bold text-custom-white">
              {despesa ? "UPDATE" : "CREATE"}
            </StyledText>
          </StyledPressable>
        </StyledView>
      )}
    </Formik>
  );
}
