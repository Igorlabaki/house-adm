import moment from "moment";
import { Formik } from "formik";
import { format } from "date-fns";
import { useDebounce } from "use-debounce";
import { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { EvilIcons } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import { Calendar } from "react-native-calendars";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import DateTimePicker from "@react-native-community/datetimepicker";

import { BugdetType, DateEventType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { ListEmpty } from "@components/list/ListEmpty";
import {
  createDateEventAsync,
  updateDateEventByIdAsync,
} from "@store/dateEvent/dateEventSlice";
import { ItemSeparatorList } from "@components/list/itemSeparatorList";
import { createDateEventFormSchema } from "@schemas/createDateFormZodSchema";
import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledTextInput,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";
import { styled } from "nativewind";
import { FlatList } from "react-native";
import { transformDate } from "function/transformData";
interface DateEventFormProps {
  dateEvent?: DateEventType;
}

export const StyledFlatList = styled(FlatList<BugdetType>);

export function DateEventFormComponent({ dateEvent }: DateEventFormProps) {
  const today = new Date();

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<any>();
  const [inicioDate, setInicioDate] = useState(new Date());
  const [orcamento, setOrcamento] = useState<BugdetType>();
  const [orcamentos, setOrcamentos] = useState<BugdetType[]>();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isHorarioFimModalOpen, setIsHorarioFimModalOpen] = useState(false);
  const [isHorarioInicioModalOpen, setIsHorarioInicioModalOpen] =
    useState(false);

  const [debouncedQuery] = useDebounce(query, 500);

  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector<RootState>(
    (state: RootState) => state.questionList.error
  );

  useEffect(() => {
    const fetchOrcamentos = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (debouncedQuery) {
          queryParams.append("query", debouncedQuery);
        }
        queryParams.append("take", "3");

        const response = await fetch(
          `https://art56-server-v2.vercel.app/orcamento/list?${queryParams.toString()}`
        ).then((data) => data.json());
        setOrcamentos(response);
      } catch (error) {
        console.error("Erro ao buscar orçamentos:", error);
      }
    };

    fetchOrcamentos();
  }, [debouncedQuery]);

  useEffect(() => {
    if (dateEvent) {
      setQuery(dateEvent?.orcamento?.nome);
    }
  }, []);

  return (
    <StyledScrollView>
      <Formik
        validationSchema={toFormikValidationSchema(createDateEventFormSchema)}
        initialValues={{
          orcamentoCheck: dateEvent && true,
          id: dateEvent?.id && dateEvent.id,
          tipo: dateEvent?.tipo && dateEvent?.tipo,
          dataFim: dateEvent?.dataFim && dateEvent?.dataFim,
          titulo: dateEvent?.titulo ? dateEvent?.titulo : "",
          orcamentoId: dateEvent?.orcamentoId && dateEvent?.orcamentoId,
          horarioFim:
            dateEvent?.dataInicio &&
            moment.utc(dateEvent?.dataFim).format("HH:mm"),
          dataInicio:
            dateEvent?.dataInicio &&
            format(dateEvent?.dataInicio, "yyyy/mm/dd"),
          horarioInicio:
            dateEvent?.dataInicio &&
            moment.utc(dateEvent?.dataInicio).format("HH:mm"),
        }}
        validate={(values) => {
          try {
            createDateEventFormSchema.parse(values);
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
            dataInicio: values?.dataInicio,
            horarioFim: values?.horarioFim,
            horarioInicio: values?.horarioInicio,
            separador: dateEvent ? "/" : undefined,
          });

          const final = new Date(dataFim.toDate());
          const inicial = new Date(dataInicial.toDate());

          if (dateEvent) {
            const newDateEvent = await dispatch(
              updateDateEventByIdAsync({
                data:{
                  dataFim: final,
                  tipo: values?.tipo,
                  dataInicio: inicial,
                  titulo: values?.titulo,
                  orcamentoId: values?.orcamentoId,
                },
                dateEventId: dateEvent?.id
              })
            );
            if (newDateEvent.meta.requestStatus == "fulfilled") {
              Toast.show("Data atualizada com sucess." as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
            }

            if (newDateEvent.meta.requestStatus == "rejected") {
              Toast.show(error as string, 3000, {
                backgroundColor: "#FF9494",
                textColor: "white",
              });
            }
          } else {
            const newDateEvent = await dispatch(
              createDateEventAsync({
                dataFim: final,
                tipo: values?.tipo,
                dataInicio: inicial,
                titulo: values?.titulo,
                orcamentoId: values?.orcamentoId,
              })
            );
            if (newDateEvent.meta.requestStatus == "fulfilled") {
              Toast.show("Data criada com sucess." as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
            }

            if (newDateEvent.meta.requestStatus == "rejected") {
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
          getFieldMeta,
          setFieldValue,
        }) => (
          <StyledView className="w-[90%] mx-auto my-5 flex flex-col">
            <StyledView className="flex flex-col gap-y-3">
              <StyledView
                className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
              >
                <StyledText className="font-semibold text-custom-gray text-[14px]">
                  Ja existe um orcamento?
                </StyledText>
                <StyledView className="flex flex-row pt-3 gap-x-1">
                  <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <StyledPressable
                      className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                      onPress={() => {
                        setFieldValue("orcamentoCheck", true);
                      }}
                    >
                      <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("orcamentoCheck").value === true && (
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
                        setFieldValue("orcamentoCheck", false);
                      }}
                    >
                      <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("orcamentoCheck").value === false && (
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
              {getFieldMeta("orcamentoCheck").value === true && (
                <StyledView>
                  <StyledView className="bg-gray-ligth  rounded-md px-3 py-1 max-h-[210px] overflow-hidden">
                    <StyledView className="w-full py-3 px-2 flex justify-start items-center  rounded-md bg-white flex-row my-3">
                      <EvilIcons name="search" size={24} color="black" />
                      <StyledTextInput
                        onChangeText={(value) => setQuery(value)}
                        value={query}
                        placeholder={"Search"}
                        className="text-sm text-gray  outline-none  flex-1 flex justify-center items-center"
                      />
                    </StyledView>
                    {orcamentos?.map((item: BugdetType) => {
                      return (
                        <StyledPressable
                          key={item.id}
                          className="flex-row justify-between items-center h-8"
                          onPress={() => {
                            setOrcamento(item);
                            setFieldValue("orcamentoId", item.id);
                            setFieldValue(
                              "horarioInicio",
                              moment.utc(dateEvent?.dataInicio).format("HH:mm")
                            );
                            setFieldValue(
                              "dataInicio",
                              format(item?.dataInicio, "dd/MM/yyyy")
                            );
                            setFieldValue(
                              "horarioFim",
                              moment.utc(dateEvent?.dataFim).format("HH:mm")
                            );
                            setFieldValue("tipo", "Evento");
                            setFieldValue("titulo", `Evento - ${item?.nome}`);
                          }}
                        >
                          <StyledText className="text-white">
                            {item.nome}
                          </StyledText>
                          <StyledView className="bg-white flex justify-center items-center   h-5 w-5">
                            {getFieldMeta("orcamentoId").value === item.id && (
                              <FontAwesome
                                name="check"
                                size={12}
                                color="black"
                              />
                            )}
                          </StyledView>
                        </StyledPressable>
                      );
                    })}
                  </StyledView>
                </StyledView>
              )}
              <StyledView
                className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
              >
                <StyledText className="font-semibold text-custom-gray text-[14px]">
                  Tipo do Evento?
                </StyledText>
                <StyledView className="flex flex-row pt-3 ">
                  <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <StyledPressable
                      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                      onPress={() => {
                        setFieldValue("tipo", "Evento");
                        setFieldValue("titulo", `Evento - ${orcamento?.nome}`);
                      }}
                    >
                      <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("tipo").value === "Evento" && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </StyledView>
                      <StyledText className="text-custom-gray text-[14px] font-semibold">
                        Evento
                      </StyledText>
                    </StyledPressable>
                  </StyledView>
                  <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <StyledPressable
                      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                      onPress={() => {
                        setFieldValue("tipo", "Visita");
                        setFieldValue("titulo", `Visita - ${orcamento?.nome}`);
                      }}
                    >
                      <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("tipo").value === "Visita" && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </StyledView>
                      <StyledText className="text-custom-gray text-[14px] font-semibold">
                        Visita
                      </StyledText>
                    </StyledPressable>
                  </StyledView>
                  <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <StyledPressable
                      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                      onPress={() => {
                        setFieldValue("tipo", "Outro");
                        setFieldValue("titulo", `Outro - ${orcamento?.nome}`);
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
                      ? getFieldMeta("dataInicio")?.value.toString()
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
                      ? getFieldMeta("horarioInicio")?.value.toString()
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
                      {errors.horarioInicio.toString()}
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
                      ? getFieldMeta("horarioFim")?.value.toString()
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
                            r.toTimeString().split(" ")[0]
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
                      {errors.horarioFim.toString()}
                    </StyledText>
                  )}
              </StyledView>
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Titulo
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("titulo")}
                  onBlur={handleBlur("titulo")}
                  value={String(values?.titulo)}
                  placeholder={
                    errors.titulo ? String(errors.titulo) : "Digite o titulo"
                  }
                  placeholderTextColor={
                    errors.titulo ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`rounded-md px-3 py-1 text-white ${
                    errors.titulo
                      ? "bg-red-50  border-[2px] border-red-900"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              {/*  <StyledText>{String(errors.titulo)}</StyledText>
              <StyledText>{String(errors.horarioFim)}</StyledText>
              <StyledText>{String(errors.horarioInicio)}</StyledText>
              <StyledText>{String(errors.tipo)}</StyledText>
              <StyledText>{String(errors.dataInicio)}</StyledText>
              <StyledText>{String(errors.orcamento)}</StyledText> */}
            </StyledView>
            <StyledPressable
              onPress={() => handleSubmit()}
              className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
            >
              <StyledText className="font-bold text-custom-white">
                {dateEvent ? "UPDATE" : "CREATE"}
              </StyledText>
            </StyledPressable>
          </StyledView>
        )}
      </Formik>
    </StyledScrollView>
  );
}
