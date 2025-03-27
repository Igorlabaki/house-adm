import moment from "moment";
import { Formik } from "formik";
import { PaymentType } from "type";
import { Image } from "react-native";
import Toast from "react-native-simple-toast";
import * as ImagePicker from "expo-image-picker";
import { Calendar } from "react-native-calendars";
import { MaterialIcons } from "@expo/vector-icons";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useRef, useState } from "react";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { updatePaymentAsync } from "@store/payment/payment-slice";
import { fetchProposalByIdAsync } from "@store/proposal/proposal-slice";
import { transformMoneyToNumber } from "function/transform-money-to-number";
import {
  CreatePaymentFormSchema,
  createPaymentFormSchema,
} from "@schemas/payment/create-payment-form";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInputMask,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";
import { TouchableOpacity } from "react-native-gesture-handler";

interface PaymentFormProps {
  proposalId: string;
  payment: PaymentType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function UpdatePaymentFormComponent({
  payment,
  proposalId,
  setIsModalOpen,
}: PaymentFormProps) {
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const [selected, setSelected] = useState<any>();
  const formikRef = useRef(null);

  const venue = useSelector((state: RootState) => state?.venueList.venue);
  const loading = useSelector(
    (state: RootState) => state?.proposalList.loading
  );

  const user = useSelector((state: RootState) => state?.session.user);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permissão para acessar as fotos é necessária!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    return result.assets[0].uri;
  };

  return (
    <Formik
      innerRef={formikRef}
      validationSchema={toFormikValidationSchema(createPaymentFormSchema)}
      initialValues={{
        amount: payment ? String(payment?.amount * 100) : "0",
        paymentDate: payment ? payment?.paymentDate : "",
      }}
      validate={(values) => {
        try {
          createPaymentFormSchema.parse(values);
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
      onSubmit={async (values: CreatePaymentFormSchema) => {
        dispatch(fetchProposalByIdAsync(proposalId));
        const response = await dispatch(
          updatePaymentAsync({
            data: {
              amount: Number(transformMoneyToNumber(values.amount)),
              paymentDate: values.paymentDate,
            },
            userId: user?.id,
            venueId: venue?.id,
            paymentId: payment.id,
            proposalId: proposalId,
            username: user?.username,
          })
        );

        if (response.meta.requestStatus == "fulfilled") {
          dispatch(fetchProposalByIdAsync(proposalId));
          Toast.show(response?.payload?.message as string, 3000, {
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
        resetForm,
      }) => {
        useEffect(() => {
          // Utilize o `setFieldValue` fora do componente, usando a referência do Formik
          if (formikRef.current && payment) {
            formikRef.current.setFieldValue(
              "paymentDate",
              moment.utc(payment?.paymentDate).format("DD/MM/yyyy")
            );
            formikRef.current.setFieldValue("amount", String(payment?.amount));
          }
        }, [payment]);
        return (
          <StyledView className=" w-full mx-auto my-5 flex flex-col px-3">
            <StyledView className="flex flex-col gap-2 ">
              <StyledView className="relative flex-col gap-y-2 flex justify-center items-center w-full ">
                <StyledView className="h-[320px] flex justify-center items-center w-full border-gray-400 rounded-md border-dotted border-spacing-3 border-[2px] cursor-pointer hover:bg-gray-100 transition duration-300">
                  {payment?.imageUrl || getFieldMeta("imageUrl").value ? (
                    <Image
                      source={{
                        uri: payment?.imageUrl
                          ? payment?.imageUrl
                          : (getFieldMeta("imageUrl").value as string),
                      }}
                      style={{ width: "100%", height: "100%" }}
                      resizeMode="cover"
                    />
                  ) : (
                    <StyledText className="text-md text-white font-bold">
                      Selecione o comprovante
                    </StyledText>
                  )}
                </StyledView>
                <StyledView className=" flex justify-center flex-row items-center gap-x-10 py-3 w-full">
                  <StyledPressable
                    onPress={async () => {
                      const url = await pickImage();
                      setFieldValue("imageUrl", url);
                    }}
                  >
                    <MaterialIcons
                      name="add-photo-alternate"
                      size={24}
                      color="white"
                    />
                  </StyledPressable>
                </StyledView>
                <StyledText className="text-red-700 text-[15px] w-full">
                  {errors.imageUrl && errors.imageUrl}
                </StyledText>
              </StyledView>
              <StyledText className="font-semibold text-custom-gray text-[14px]">
                Data do Pagamento:
              </StyledText>
              <StyledPressable
                onPress={() => setIsCalendarModalOpen(true)}
                className={`rounded-md px-3 py-1 text-white ${
                  errors.paymentDate
                    ? "bg-red-50 border-[2px] border-red-900 text-red-800 "
                    : "bg-gray-ligth"
                }`}
              >
                <StyledText
                  className={`
                    ${
                      (getFieldMeta("paymentDate")?.value as string)
                        ? "text-white"
                        : "text-['rgb(156 163 175)']"
                    }
                    text-white  py-1 ${
                      errors.paymentDate
                        ? " text-red-800 font-normal"
                        : "font-semibold"
                    }}`}
                >
                  {(getFieldMeta("paymentDate")?.value as string)
                    ? getFieldMeta("paymentDate")?.value?.toString()
                    : ""}
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
                  <StyledView className="rounded-md overflow-hidden flex justify-center mx-auto h-full z-40">
                    <Calendar
                      onDayPress={(day) => {
                        setFieldValue(
                          "paymentDate",
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
              {errors?.paymentDate &&
                errors?.paymentDate.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors.paymentDate?.toString()}
                  </StyledText>
                )}
            </StyledView>
            <StyledView className="flex flex-col gap-y-2 mt-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Valor Pago
              </StyledText>
              <StyledTextInputMask
                onFocus={(e) => e.stopPropagation()}
                className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                  errors.amount
                    ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                    : "bg-gray-ligth"
                }`}
                type="money"
                options={{
                  maskType: "BRL",
                }}
                onChangeText={handleChange("amount")}
                onBlur={handleBlur("amount")}
                value={String(Number(values.amount) * 100)}
              />
              {errors?.amount && errors?.amount.toString() != "Required" && (
                <StyledText className="text-red-700 font-semibold">
                  {errors.amount?.toString()}
                </StyledText>
              )}
            </StyledView>

            <StyledView className="flex flex-col justify-center items-center gap-y-2 w-full mt-5">
              <StyledPressable
                onPress={() => {
                  handleSubmit();
                }}
                className="bg-gray-ligth flex justify-center items-center py-3  rounded-md w-full"
              >
                <StyledText className="font-bold text-custom-white">
                  {loading ? "Enviando" : "Atualizar"}
                </StyledText>
              </StyledPressable>
            </StyledView>
          </StyledView>
        );
      }}
    </Formik>
  );
}
