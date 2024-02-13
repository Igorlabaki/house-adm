import { useState, useEffect } from "react";
import Toast from "react-native-simple-toast";
import { Entypo } from "@expo/vector-icons";
import { Formik } from "formik";
import { BugdetType, DateEventType } from "../../../../../../type";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { FontAwesome } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  TextInput,
  View,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AppDispatch, RootState } from "../../../../../../store";
import { createDateEventFormSchema } from "../../../../../../zod/schemas/createDateFormZodSchema";
import { Calendar } from "react-native-calendars";
import DateTimePicker from "@react-native-community/datetimepicker";
import { createDateEventAsync } from "../../../../../../store/dateEvent/dateEventSlice";
import { transformDate } from "../../../../../../function/transformData";
import { fecthOrcamentos } from "../../../../../../store/budget/bugetSlice";
import SearchFilterListComponent from "../../../../../../components/list/searchFilterList";
import { format } from "date-fns";
import moment from "moment";

interface DateEventFormProps {
  dateEvent?: DateEventType;
}

export function DateEventFormComponent({ dateEvent }: DateEventFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.questionList.error
  );

  const orcamentosList = useSelector(
    (state: RootState) => state.orcamentosList
  );

  useEffect(() => {
    dispatch(fecthOrcamentos());
  }, []);

  const [selected, setSelected] = useState<any>();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [isHorarioInicioModalOpen, setIsHorarioInicioModalOpen] =
    useState(false);
  const [isHorarioFimModalOpen, setIsHorarioFimModalOpen] = useState(false);
  const today = new Date();

  const [inicioDate, setInicioDate] = useState(new Date());
  const [fimDate, setFimDate] = useState(new Date());

  return (
    <ScrollView>
      <Formik
        validationSchema={toFormikValidationSchema(createDateEventFormSchema)}
        initialValues={{
          id: dateEvent?.id && dateEvent.id,
          tipo: dateEvent?.tipo && dateEvent?.tipo,
          titulo: dateEvent?.titulo ? dateEvent?.titulo : "",
          dataFim: dateEvent?.dataFim && dateEvent?.dataFim,
          orcamentoId: dateEvent?.orcamentoId && dateEvent?.orcamentoId,
          dataInicio: dateEvent?.dataInicio && dateEvent?.dataInicio,
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
          const [dayInicio, monthInicio, yearInicio] =
            values.dataInicio.split("/");
          const [hourInicio, minutesInicio] = values.horarioInicio.split(":");
          const [hourFim, minutesFim] = values.horarioFim.split(":");

          const dataInicial = moment
            .utc(
              `${yearInicio}-${monthInicio}-${dayInicio} ${hourInicio}:${minutesInicio}`,
              "YYYY-MM-DD HH:mm"
            )
            .toISOString();

          const dataFim = moment
            .utc(
              `${yearInicio}-${monthInicio}-${dayInicio} ${hourFim}:${minutesFim}`,
              "YYYY-MM-DD HH:mm"
            )
            .toISOString();

          const final = new Date(dataFim);
          const inicial = new Date(dataInicial);

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
          <View className="w-[90%] mx-auto my-5 flex flex-col">
            <View className="flex flex-col gap-y-3">
              <View
                className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
              >
                <Text className="font-semibold text-custom-gray text-[14px]">
                  Ja existe um orcamento?
                </Text>
                <View className="flex flex-row pt-3 gap-x-1">
                  <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <Pressable
                      className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                      onPress={() => {
                        setFieldValue("orcamentoCheck", true);
                      }}
                    >
                      <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("orcamentoCheck").value === true && (
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
                        setFieldValue("orcamentoCheck", false);
                      }}
                    >
                      <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("orcamentoCheck").value === false && (
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
              {getFieldMeta("orcamentoCheck").value === true && (
                <ScrollView>
                  <View className="bg-gray-ligth  rounded-md px-3 py-1 max-h-[210px] overflow-hidden">
                    <SearchFilterListComponent fectData={fecthOrcamentos} />
                    {orcamentosList.orcamentos.map((item: BugdetType) => {
                      return (
                        <Pressable
                          key={item.id}
                          className="flex-row justify-between items-center h-8"
                          onPress={() => {
                            setFieldValue("orcamentoId", item.id);
                            setFieldValue(
                              "horarioInicio",
                              format(item?.dataInicio, "HH:mm")
                            );
                            setFieldValue(
                              "dataInicio",
                              format(item?.dataInicio, "dd/MM/yyyy")
                            );
                            setFieldValue(
                              "horarioFim",
                              format(item?.dataFim, "HH:mm")
                            );
                            setFieldValue("tipo", "Evento");
                            setFieldValue("titulo", `Evento - ${item?.nome}`);
                          }}
                        >
                          <Text className="text-white">{item.nome}</Text>
                          <View className="bg-white flex justify-center items-center   h-5 w-5">
                            {getFieldMeta("orcamentoId").value === item.id && (
                              <FontAwesome
                                name="check"
                                size={12}
                                color="black"
                              />
                            )}
                          </View>
                        </Pressable>
                      );
                    })}
                  </View>
                </ScrollView>
              )}
              <View
                className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
              >
                <Text className="font-semibold text-custom-gray text-[14px]">
                  Tipo do Evento?
                </Text>
                <View className="flex flex-row pt-3 ">
                  <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <Pressable
                      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                      onPress={() => {
                        setFieldValue("tipo", "Evento");
                      }}
                    >
                      <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("tipo").value === "Evento" && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </View>
                      <Text className="text-custom-gray text-[14px] font-semibold">
                        Evento
                      </Text>
                    </Pressable>
                  </View>
                  <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <Pressable
                      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                      onPress={() => {
                        setFieldValue("tipo", "Visita");
                      }}
                    >
                      <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("tipo").value === "Visita" && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </View>
                      <Text className="text-custom-gray text-[14px] font-semibold">
                        Visita
                      </Text>
                    </Pressable>
                  </View>
                  <View className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                    <Pressable
                      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                      onPress={() => {
                        setFieldValue("tipo", "Outro");
                      }}
                    >
                      <View className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                        {getFieldMeta("tipo").value === "Outro" && (
                          <Entypo name="check" size={12} color="white" />
                        )}
                      </View>
                      <Text className="text-custom-gray text-[14px] font-semibold">
                        Outro
                      </Text>
                    </Pressable>
                  </View>
                </View>
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
              <View className="flex flex-col gap-y-1">
                <Text className="text-custom-gray text-[14px] font-semibold">
                  Titulo
                </Text>
                <TextInput
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
              </View>
              {/*  <Text>{String(errors.titulo)}</Text>
              <Text>{String(errors.horarioFim)}</Text>
              <Text>{String(errors.horarioInicio)}</Text>
              <Text>{String(errors.tipo)}</Text>
              <Text>{String(errors.dataInicio)}</Text>
              <Text>{String(errors.orcamento)}</Text> */}
            </View>
            <Pressable
              onPress={() => handleSubmit()}
              className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
            >
              <Text className="font-bold text-custom-white">
                {dateEvent ? "UPDATE" : "CREATE"}
              </Text>
            </Pressable>
          </View>
        )}
      </Formik>
    </ScrollView>
  );
}
