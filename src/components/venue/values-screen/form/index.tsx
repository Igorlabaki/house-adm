import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { SeasonalFeeType } from "type";
import { AppDispatch, RootState } from "@store/index";

import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";

import { Venue } from "@store/venue/venueSlice";
import {
  createSurchargeFeesAsync,
  deleteSurchargeFeesByIdAsync,
  updateSurchargeFeesByIdAsync,
} from "@store/surcharge-fee/surcharge-fee";
import { format, parse } from "date-fns";
import { createSeasonalFeeSchema } from "@schemas/seasonalFee/create-seasonal-fee-params-schema";
import {
  FormSeasonalFeeRequestParams,
  formSeasonalFeeSchema,
} from "@schemas/seasonalFee/form-seasonal-fee-params-schema";
import { useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import moment, { weekdays } from "moment";
import { Entypo, Feather } from "@expo/vector-icons";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { ActivityIndicator } from "react-native";

interface SeasonalFeeFormProps {
  isModalOpen: boolean;
  type: "SURCHARGE" | "DISCOUNT";
  seasonalFee?: SeasonalFeeType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function SeasonalFeeFormComponent({
  type,
  seasonalFee,
  isModalOpen,
  setIsModalOpen,
}: SeasonalFeeFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const venue: Venue = useSelector(
    (state: RootState) => state?.venueList.venue
  );

  const loading: boolean = useSelector(
    (state: RootState) => state?.surchargefeesState.loading
  );

  const weekDays = [
    { display: "Segunda-feira", value: "monday" },
    { display: "Terça-feira", value: "tuesday" },
    { display: "Quarta-feira", value: "wednesday" },
    { display: "Quinta-feira", value: "thursday" },
    { display: "Sexta-feira", value: "friday" },
    { display: "Sábado", value: "saturday" },
    { display: "Domingo", value: "sunday" },
  ];

  const [weekList, setWeekList] = useState([]);

  const [selected, setSelected] = useState<any>();

  const [isStartCalendarModalOpen, setStartIsCalendarModalOpen] =
    useState(false);
  const [isEndCalendarModalOpen, setEndIsCalendarModalOpen] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const deleteItem = await dispatch(
      deleteSurchargeFeesByIdAsync(seasonalFee.id)
    );

    if (deleteItem.meta.requestStatus === "fulfilled") {
      Toast.show("Contrato deletada com sucesso." as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
    }

    if (deleteItem.meta.requestStatus == "rejected") {
      Toast.show(deleteItem.payload, 3000, {
        backgroundColor: "#FF9494",
        textColor: "white",
      });
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      animationType="fade"
    >
      <Formik
        validationSchema={toFormikValidationSchema(formSeasonalFeeSchema)}
        initialValues={{
          type: type,
          venueId: venue.id,
          fee: seasonalFee?.fee || "0",
          title: seasonalFee?.title || "",
          endDay: seasonalFee?.endDay || "",
          startDay: seasonalFee?.startDay || "",
          affectedDays: seasonalFee?.affectedDays.split(",") || [],
          periodType: seasonalFee?.affectedDays ? "WEEKDAYS" : "SEASON",
        }}
        validate={(values) => {
          try {
            formSeasonalFeeSchema.parse(values);
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
        onSubmit={async (values: FormSeasonalFeeRequestParams) => {
          if (!seasonalFee) {
            const response = await dispatch(
              createSurchargeFeesAsync({
                type: values?.type,
                title: values?.title,
                endDay: values?.endDay,
                venueId: values?.venueId,
                fee: Number(values?.fee),
                startDay: values?.startDay,
                affectedDays: values?.affectedDays?.join(","),
              })
            );

            if (response.meta.requestStatus == "fulfilled") {
              Toast.show("Taxa criada com sucesso." as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
              setIsModalOpen(false);
            }

            if (response.meta.requestStatus == "rejected") {
              Toast.show(response.payload as string, 3000, {
                backgroundColor: "#FF9494",
                textColor: "white",
              });
            }
          } else {
            const response = await dispatch(
              updateSurchargeFeesByIdAsync({
                venueId: venue?.id,
                seasonalFeeId: seasonalFee?.id,
                data: {
                  ...values,
                  fee: Number(values?.fee),
                  affectedDays: values?.affectedDays?.join(","),
                },
              })
            );

            if (response.meta.requestStatus == "fulfilled") {
              Toast.show("Taxa atualizada com sucesso." as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
              setIsModalOpen(false);
            }

            if (response.meta.requestStatus == "rejected") {
              Toast.show(response.payload as string, 3000, {
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
          setFieldValue,
          getFieldMeta,
          values,
          errors,
        }) => {
          useEffect(() => {
            setFieldValue("affectedDays", weekList);
          }, [weekList]);

          return (
            <StyledView className="bg-gray-dark flex-1 pt-5 flex flex-col h-full w-full px-3">
              {seasonalFee && (
                <StyledPressable
                  onPress={async () => handleDelete()}
                  className="absolute top-5 right-5"
                >
                  <Feather name="trash" size={16} color="white" />
                </StyledPressable>
              )}
              <StyledView className="flex flex-col gap-y-3 mt-3">
                <StyledView
                  className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap"`}
                >
                  <StyledText className="font-semibold text-custom-gray text-[14px]">
                    Tipo do Taxa:
                  </StyledText>
                  <StyledView className="flex flex-row pt-3 ">
                    <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                      <StyledPressable
                        className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                        onPress={() => {
                          setFieldValue("periodType", "SEASON");
                        }}
                      >
                        <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                          {getFieldMeta("periodType").value === "SEASON" && (
                            <Entypo name="check" size={12} color="white" />
                          )}
                        </StyledView>
                        <StyledText className="text-custom-gray text-[14px] font-semibold">
                          Temporada
                        </StyledText>
                      </StyledPressable>
                    </StyledView>
                    <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                      <StyledPressable
                        className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
                        onPress={() => {
                          setFieldValue("periodType", "WEEKDAYS");
                        }}
                      >
                        <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                          {getFieldMeta("periodType").value === "WEEKDAYS" && (
                            <Entypo name="check" size={12} color="white" />
                          )}
                        </StyledView>
                        <StyledText className="text-custom-gray text-[14px] font-semibold">
                          Dias da semana
                        </StyledText>
                      </StyledPressable>
                    </StyledView>
                  </StyledView>
                </StyledView>
                <StyledView className="flex flex-col gap-y-1">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Titulo
                  </StyledText>
                  <StyledTextInput
                    onChangeText={handleChange("title")}
                    onBlur={handleBlur("title")}
                    value={values.title}
                    placeholder={
                      errors.title ? errors.title : "Digite pergunta"
                    }
                    placeholderTextColor={
                      errors.title ? "rgb(127 29 29)" : "rgb(156 163 175)"
                    }
                    className={`rounded-md px-3 py-1 text-white ${
                      errors.title
                        ? "bg-red-50  border-[2px] border-red-900"
                        : "bg-gray-ligth"
                    }`}
                  />
                </StyledView>
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="font-semibold text-custom-gray text-[14px]">
                    Taxa de Aumento ( % ) :
                  </StyledText>
                  <StyledTextInput
                    onChangeText={handleChange("fee")}
                    onBlur={handleBlur("fee")}
                    value={String(values?.fee)}
                    maxLength={3}
                    placeholder={
                      errors.fee
                        ? errors.fee
                        : "Digite a porcentagem do adicional de temporada"
                    }
                    placeholderTextColor={
                      errors?.fee ? "rgb(127 29 29)" : "rgb(156 163 175)"
                    }
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white w-full ${
                      errors?.fee
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                  />
                </StyledView>
                {getFieldMeta("periodType").value === "SEASON" && (
                  <>
                    <StyledView className="flex flex-col gap-2 mt-2">
                      <StyledText className="font-semibold text-custom-gray text-[14px]">
                        Data do Inicio da Temporada :
                      </StyledText>
                      <StyledPressable
                        onPress={() => setStartIsCalendarModalOpen(true)}
                        className={`rounded-md px-3 py-1 text-white ${
                          errors.startDay
                            ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                            : "bg-gray-ligth"
                        }`}
                      >
                        <StyledText
                          className={`
                    ${
                      (getFieldMeta("startDay")?.value as string)
                        ? "text-white"
                        : "text-['rgb(156 163 175)']"
                    }
                    text-white  py-1 ${
                      errors.startDay
                        ? " text-red-800 font-normal"
                        : "font-semibold"
                    }}`}
                        >
                          {(getFieldMeta("startDay")?.value as string)
                            ? getFieldMeta("startDay")?.value?.toString()
                            : "Escolha a data de inicio da temporada"}
                        </StyledText>
                      </StyledPressable>
                      <StyledModal
                        visible={isStartCalendarModalOpen}
                        onRequestClose={() =>
                          setStartIsCalendarModalOpen(false)
                        }
                        animationType="fade"
                        transparent={true}
                        className="bg-black"
                      >
                        <StyledTouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => {
                            setStartIsCalendarModalOpen(false);
                          }}
                        >
                          <StyledView className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                            <Calendar
                              onDayPress={(day) => {
                                setFieldValue(
                                  "startDay",
                                  moment.utc(day.dateString).format("DD/MM")
                                );
                                setSelected(day.dateString);
                                setStartIsCalendarModalOpen(false);
                              }}
                              markedDates={{
                                "2024-01-22": {
                                  selected: true,
                                  marked: true,
                                  disableTouchEvent: true,
                                  selectedColor: "gray",
                                },
                                [selected]: {
                                  selected: true,
                                  selectedColor: "blue",
                                },
                              }}
                            />
                          </StyledView>
                        </StyledTouchableOpacity>
                      </StyledModal>
                    </StyledView>
                    <StyledView className="flex flex-col gap-2 mt-2">
                      <StyledText className="font-semibold text-custom-gray text-[14px]">
                        Data do Fim da Temporada :
                      </StyledText>
                      <StyledPressable
                        onPress={() => setEndIsCalendarModalOpen(true)}
                        className={`rounded-md px-3 py-1 text-white ${
                          errors.endDay
                            ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                            : "bg-gray-ligth"
                        }`}
                      >
                        <StyledText
                          className={`
                    ${
                      (getFieldMeta("endDay")?.value as string)
                        ? "text-white"
                        : "text-['rgb(156 163 175)']"
                    }
                    text-white  py-1 ${
                      errors.endDay
                        ? " text-red-800 font-normal"
                        : "font-semibold"
                    }}`}
                        >
                          {(getFieldMeta("endDay")?.value as string)
                            ? getFieldMeta("endDay")?.value?.toString()
                            : "Escolha a data de inicio da temporada"}
                        </StyledText>
                      </StyledPressable>
                      <StyledModal
                        visible={isEndCalendarModalOpen}
                        onRequestClose={() => setEndIsCalendarModalOpen(false)}
                        animationType="fade"
                        transparent={true}
                        className="bg-black"
                      >
                        <StyledTouchableOpacity
                          style={{ flex: 1 }}
                          onPress={() => {
                            setEndIsCalendarModalOpen(false);
                          }}
                        >
                          <StyledView className="rounded-md overflow-hidden flex justify-center min-w-[80%] mx-auto h-full z-40">
                            <Calendar
                              onDayPress={(day) => {
                                setFieldValue(
                                  "endDay",
                                  moment.utc(day.dateString).format("DD/MM")
                                );
                                setSelected(day.dateString);
                                setEndIsCalendarModalOpen(false);
                              }}
                              markedDates={{
                                "2024-01-22": {
                                  selected: true,
                                  marked: true,
                                  disableTouchEvent: true,
                                  selectedColor: "gray",
                                },
                                [selected]: {
                                  selected: true,
                                  selectedColor: "blue",
                                },
                              }}
                            />
                          </StyledView>
                        </StyledTouchableOpacity>
                      </StyledModal>
                    </StyledView>
                  </>
                )}
                {getFieldMeta("periodType").value === "WEEKDAYS" && (
                  <StyledView className="flex flex-col gap-y-2">
                    <StyledText className="font-semibold text-custom-gray text-[14px]">
                      Selecione os Dias:
                    </StyledText>
                    <StyledView className="flex flex-row flex-wrap justify-start items-center gap-x-5 gap-y-1 px-2">
                      {weekDays.map(
                        (item: { display: string; value: string }) => {
                          return (
                            <StyledView
                              key={item.display}
                              className="flex  text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px] w-[100px]"
                            >
                              <StyledPressable
                                className="flex flex-row items-center justify-start gap-x-2 cursor-pointer "
                                onPress={() => {
                                  setWeekList(
                                    (prev) =>
                                      prev.includes(item.value)
                                        ? prev.filter(
                                            (day) => day !== item.value
                                          ) // Remove da lista
                                        : [...prev, item.value] // Adiciona na lista
                                  );
                                }}
                              >
                                <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                                  {weekList.includes(item.value) && (
                                    <Entypo
                                      name="check"
                                      size={12}
                                      color="white"
                                    />
                                  )}
                                </StyledView>
                                <StyledText className="text-custom-gray text-[14px] font-semibold">
                                  {item.display}
                                </StyledText>
                              </StyledPressable>
                            </StyledView>
                          );
                        }
                      )}
                    </StyledView>
                  </StyledView>
                )}
              </StyledView>
              <StyledPressable
                onPress={() => {
                  handleSubmit();
                }}
                className="bg-green-800 flex justify-center items-center py-3 mt-5 rounded-md"
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#faebd7" />
                ) : (
                  <StyledText className="font-bold text-custom-white">
                    {seasonalFee ? "Atualizar" : "Cadastrar"}
                  </StyledText>
                )}
              </StyledPressable>
            </StyledView>
          );
        }}
      </Formik>
      <DeleteConfirmationModal
        entity="adicional"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
