import moment from "moment";
import { Formik } from "formik";
import { PaymentType } from "type";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import Toast from "react-native-simple-toast";
import { Calendar } from "react-native-calendars";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  createPaymentAsync,
  updatePaymentAsync,
} from "@store/payment/payment-slice";
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

interface PaymentFormProps {
  proposalId: string;
  selectedPayment: PaymentType;
  setDeleteModalIsOpen: (value: React.SetStateAction<boolean>) => void;
  setSelectedPayment: (value: React.SetStateAction<PaymentType | null>) => void;
}

export function PaymentFormComponent({
  proposalId,
  selectedPayment,
  setSelectedPayment,
  setDeleteModalIsOpen,
}: PaymentFormProps) {
  const [selected, setSelected] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const formikRef = useRef(null);
  const venue = useSelector((state: RootState) => state?.venueList.venue);
  const user = useSelector((state: RootState) => state?.user.user);
  return (
    <Formik
      innerRef={formikRef}
      validationSchema={toFormikValidationSchema(createPaymentFormSchema)}
      initialValues={{
        amount: selectedPayment ? String(selectedPayment?.amount * 100) : "0",
        paymentDate: selectedPayment ? selectedPayment?.paymentDate : "",
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
        setIsLoading(true);
        if (selectedPayment) {
          const response = await dispatch(
            updatePaymentAsync({
              data: {
                amount: Number(transformMoneyToNumber(values.amount)),
                paymentDate: values.paymentDate,
              },
              userId: user?.id,
              venueId: venue?.id,
              proposalId: proposalId,
              username: user?.username,
              paymentId: selectedPayment.id
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            dispatch(fetchProposalByIdAsync(proposalId));
            Toast.show(response?.payload?.message as string, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setSelectedPayment(null);
          }

          if (response.meta.requestStatus == "rejected") {
            Toast.show(response.payload as string, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }

          setIsLoading(false);
          return;
        }

        const response = await dispatch(
          createPaymentAsync({
            amount: Number(transformMoneyToNumber(values.amount)),
            paymentDate: values.paymentDate,
            proposalId: proposalId,
            userId: user?.id,
            username: user?.username,
            venueId: venue?.id,
          })
        );

        if (response.meta.requestStatus == "fulfilled") {
          dispatch(fetchProposalByIdAsync(proposalId));
          Toast.show(response?.payload?.message, 3000, {
            backgroundColor: "rgb(75,181,67)",
            textColor: "white",
          });
        }

        if (response.meta.requestStatus == "rejected") {
          Toast.show(response?.payload, 3000, {
            backgroundColor: "#FF9494",
            textColor: "white",
          });
        }

        setIsLoading(false);
        return;
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
          if (formikRef.current && selectedPayment) {
            formikRef.current.setFieldValue(
              "paymentDate",
              moment.utc(selectedPayment?.paymentDate).format("DD/MM/yyyy")
            );
            formikRef.current.setFieldValue(
              "amount",
              String(selectedPayment?.amount)
            );
          }
        }, [selectedPayment]);
        return (
          <StyledView className=" w-full mx-auto my-5 flex flex-col">
            <StyledView className="flex flex-col gap-2 ">
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
              {errors?.paymentDate && errors?.paymentDate.toString() != "Required" && (
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
                  {isLoading
                    ? "Enviando"
                    : selectedPayment
                    ? "Atualizar"
                    : "Criar"}
                </StyledText>
              </StyledPressable>
              {selectedPayment && (
                <StyledPressable
                  onPress={() => {
                    setDeleteModalIsOpen(true);
                  }}
                  className="bg-gray-ligth flex justify-center items-center py-3 rounded-md w-full"
                >
                  <StyledText className="font-bold text-custom-white">
                    {isLoading ? "Deletando" : "Deletar"}
                  </StyledText>
                </StyledPressable>
              )}
            </StyledView>
          </StyledView>
        );
      }}
    </Formik>
  );
}
