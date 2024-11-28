import { createPagamentoFormSchema } from "@schemas/createPagamentoFormZodSchema";
import { format } from "date-fns";
import { Formik } from "formik";
import React, { useState } from "react";
import { Calendar } from "react-native-calendars";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInputMask,
  StyledTouchableOpacity,
  StyledView,
} from "styledComponents";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { SERVER_URL } from "@env";
import { criarPagamento } from "function/createPagamento";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@store/index";
import { fetchOrcamentoById } from "@store/orcamento/orcamentoSlice";
import { Pagamento } from "type";
import moment from "moment";
interface PagamentoFormProps {
  orcamentoId: string;
  pagamentoSeleiconada: Pagamento;
  setPagamentoModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface PagamentoRequestParams {
  value: string;
  orcamentoId: string;
  dataPagamento: string;
}

export function PagamentoFormComponent({
  orcamentoId,
  pagamentoSeleiconada,
  setPagamentoModalIsOpen,
}: PagamentoFormProps) {
  const [selected, setSelected] = useState<any>();
  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  return (
    <Formik
      validationSchema={toFormikValidationSchema(createPagamentoFormSchema)}
      initialValues={{
        orcamentoId: orcamentoId,
        value: pagamentoSeleiconada ? pagamentoSeleiconada?.value: "",
        dataPagamento: pagamentoSeleiconada ? pagamentoSeleiconada?.dataPagamento :"",
      }}
      validate={(values) => {
        try {
          createPagamentoFormSchema.parse(values);
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
      onSubmit={async (values: PagamentoRequestParams) => {
        await criarPagamento(values)
        dispatch(fetchOrcamentoById(orcamentoId))
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
        resetForm
      }) => (
        <StyledView className=" w-full mx-auto my-5 flex flex-col">
          <StyledView className="flex flex-col gap-2 ">
            <StyledText className="font-semibold text-custom-gray text-[14px]">
              Data do Pagamento:
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
                        "dataPagamento",
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
          <StyledView className="flex flex-col gap-y-2 mt-2">
            <StyledText className="text-custom-gray text-[14px] font-semibold">
              Valor Pago
            </StyledText>
            <StyledTextInputMask
              onFocus={(e) => e.stopPropagation()}
              className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                errors.value
                  ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                  : "bg-gray-ligth"
              }`}
              type="money"
              options={{
                maskType: "BRL",
              }}
              onChangeText={handleChange("value")}
              onBlur={handleBlur("value")}
              value={values.value}
            />
            {errors?.value && errors?.value.toString() != "Required" && (
              <StyledText className="text-red-700 font-semibold">
                {errors.value?.toString()}
              </StyledText>
            )}
          </StyledView>

          <StyledPressable
            onPress={() => {
              handleSubmit();
            }}
            className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
          >
            <StyledText className="font-bold text-custom-white">
              Salvar
            </StyledText>
          </StyledPressable>
        </StyledView>
      )}
    </Formik>
  );
}
