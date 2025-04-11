import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { GoalType, SeasonalFeeType } from "type";
import { AppDispatch, RootState } from "@store/index";

import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
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
import {
  CreateGoalRequestParams,
  createGoalSchema,
} from "@schemas/goal/create-goal-params-schema";
import { createGoalAsync, deleteGoalByIdAsync, updateGoalByIdAsync } from "@store/goal/goal-slice";
import { transformMoneyToNumber } from "function/transform-money-to-number";

interface SeasonalFeeFormProps {
  goal?: GoalType;
  isModalOpen: boolean;
  seasonalFee?: SeasonalFeeType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function GoalFormComponent({
  goal,
  isModalOpen,
  setIsModalOpen,
}: SeasonalFeeFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const venue: Venue = useSelector(
    (state: RootState) => state?.venueList.venue
  );

  const loading: boolean = useSelector(
    (state: RootState) => state?.goalState.loading
  );

  const months = [
    { display: "Jan", value: "1" },
    { display: "Fev", value: "2" },
    { display: "Mar", value: "3" },
    { display: "Abr", value: "4" },
    { display: "Mai", value: "5" },
    { display: "Jun", value: "6" },
    { display: "Jul", value: "7" },
    { display: "Ago", value: "8" },
    { display: "Set", value: "9" },
    { display: "Out", value: "10" },
    { display: "Nov", value: "11" },
    { display: "Dez", value: "12" },
  ];

  const [monthsList, setMonthsList] = useState(
    goal ? goal.months.split(",") : []
  );

  const [selected, setSelected] = useState<any>();

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const deleteItem = await dispatch(
      deleteGoalByIdAsync(goal.id)
    );

    if (deleteItem.meta.requestStatus === "fulfilled") {
      Toast.show("Meta deletada com sucesso." as string, 3000, {
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
        validationSchema={toFormikValidationSchema(createGoalSchema)}
        initialValues={{
          venueId: venue.id,
          months: goal?.months ? goal?.months.split(",") : [""],
          maxValue: goal?.maxValue ? String(goal?.maxValue) : "",
          minValue: goal?.minValue ? String(goal?.minValue) : "",
          increasePercent: goal?.increasePercent
            ? String(goal?.increasePercent)
            : "",
        }}
        validate={(values) => {
          try {
            createGoalSchema.parse(values);
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
        onSubmit={async (values: CreateGoalRequestParams) => {
         if (!goal) {
            const response = await dispatch(
              createGoalAsync({
                ...values,
                minValue: transformMoneyToNumber(values.minValue),
                maxValue: transformMoneyToNumber(values.maxValue),
              })
            );

            if (response.meta.requestStatus == "fulfilled") {
              Toast.show("Meta criada com sucesso." as string, 3000, {
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
              updateGoalByIdAsync({
                goalId: goal?.id,
                venueId: venue?.id,
                data: {
                  months: values.months.join(","),
                  minValue: Number(transformMoneyToNumber(values.minValue)),
                  maxValue: Number(transformMoneyToNumber(values.maxValue)),
                  increasePercent: Number(transformMoneyToNumber(values.increasePercent)),
                },
              })
            );

            if (response.meta.requestStatus == "fulfilled") {
              Toast.show("Meta atualizada com sucesso." as string, 3000, {
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
            setFieldValue("months", monthsList);
          }, [monthsList]);
        
          return (
            <StyledView className="bg-gray-dark flex-1 pt-5 flex flex-col h-full w-full px-3">
              {goal && (
                <StyledPressable
                  onPress={async () => handleDelete()}
                  className="absolute top-5 right-5"
                >
                  <Feather name="trash" size={16} color="white" />
                </StyledPressable>
              )}
              <StyledView className="flex flex-col gap-y-3 mt-3">
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    MInimo
                  </StyledText>
                  <StyledTextInputMask
                    onFocus={(e) => e.stopPropagation()}
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                      errors.minValue
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                    type="money"
                    options={{
                      maskType: "BRL",
                    }}
                    onChangeText={handleChange("minValue")}
                    onBlur={handleBlur("minValue")}
                    value={String(Number(values.minValue) * 100)}
                  />
                  {errors?.minValue &&
                    errors?.minValue?.toString() != "Required" && (
                      <StyledText className="text-red-700 font-semibold">
                        {errors.minValue?.toString()}
                      </StyledText>
                    )}
                </StyledView>
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="text-custom-gray text-[14px] font-semibold">
                    Maximo
                  </StyledText>
                  <StyledTextInputMask
                    onFocus={(e) => e.stopPropagation()}
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                      errors.minValue
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                    type="money"
                    options={{
                      maskType: "BRL",
                    }}
                    onChangeText={handleChange("maxValue")}
                    onBlur={handleBlur("maxValue")}
                    value={String(Number(values.maxValue) * 100)}
                  />
                  {errors?.maxValue &&
                    errors?.maxValue?.toString() != "Required" && (
                      <StyledText className="text-red-700 font-semibold">
                        {errors.maxValue?.toString()}
                      </StyledText>
                    )}
                </StyledView>
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="font-semibold text-custom-gray text-[14px]">
                    Taxa de Aumento ( % ) :
                  </StyledText>
                  <StyledTextInput
                    onChangeText={handleChange("increasePercent")}
                    onBlur={handleBlur("increasePercent")}
                    value={String(values?.increasePercent)}
                    maxLength={3}
                    placeholder={
                      errors.increasePercent
                        ? errors.increasePercent
                        : "Digite a porcentagem do adicional de temporada"
                    }
                    placeholderTextColor={
                      errors?.increasePercent
                        ? "rgb(127 29 29)"
                        : "rgb(156 163 175)"
                    }
                    className={`bg-gray-ligth rounded-md px-3 py-1 text-white w-full ${
                      errors?.increasePercent
                        ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                        : "bg-gray-ligth"
                    }`}
                  />
                </StyledView>
                <StyledView className="flex flex-col gap-y-2">
                  <StyledText className="font-semibold text-custom-gray text-[14px]">
                    Selecione os Meses:
                  </StyledText>
                  <StyledView className="flex flex-row flex-wrap justify-start items-center gap-x-5 gap-y-1 px-2">
                    {months.map((item: { display: string; value: string }) => {
                      months.includes(item.value);
                      return (
                        <StyledView
                          key={item.display}
                          className="flex  text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px] w-[100px]"
                        >
                          <StyledPressable
                            className="flex flex-row items-center justify-start gap-x-2 cursor-pointer "
                            onPress={() => {
                              setMonthsList(
                                (prev) =>
                                  prev.includes(item.value)
                                    ? prev.filter((day) => day !== item.value) // Remove da lista
                                    : [...prev, item.value] // Adiciona na lista
                              );
                            }}
                          >
                            <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                              {monthsList.includes(item.value) && (
                                <Entypo name="check" size={12} color="white" />
                              )}
                            </StyledView>
                            <StyledText className="text-custom-gray text-[14px] font-semibold">
                              {item.display}
                            </StyledText>
                          </StyledPressable>
                        </StyledView>
                      );
                    })}
                  </StyledView>
                </StyledView>
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
                    {goal ? "Atualizar" : "Cadastrar"}
                  </StyledText>
                )}
              </StyledPressable>
            </StyledView>
          );
        }}
      </Formik>
      <DeleteConfirmationModal
        entity="meta"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
