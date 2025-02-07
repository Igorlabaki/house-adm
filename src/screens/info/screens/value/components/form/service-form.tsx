import { Formik } from "formik";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { AppDispatch, RootState } from "@store/index";
import {
  CreateServiceFormData,
  createServiceFormSchema,
} from "@schemas/service/create-service-params-schema";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledView,
} from "styledComponents";
import {
  createServiceAsync,
  ServiceType,
  updateServiceByIdAsync,
} from "@store/service/service-slice";
import { Venue } from "@store/venue/venueSlice";
import {
  formServiceSchema,
  FormServiceSchema,
} from "@schemas/service/form-service-schema";
import { transformMoneyToNumber } from "function/transform-money-to-number";

interface ServiceFormProps {
  service?: ServiceType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ServiceForm({ service, setIsModalOpen }: ServiceFormProps) {
  const dispatch = useDispatch<AppDispatch>();

  const venue: Venue = useSelector<RootState>(
    (state: RootState) => state.venueList.venue
  );

  return (
    <Formik
      validationSchema={toFormikValidationSchema(formServiceSchema)}
      initialValues={{
        venueId: venue.id,
        name: service?.name ? service.name : "",
        price: service?.price && String(service.price),
      }}
      validate={(values) => {
        try {
          formServiceSchema.parse(values);
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
      onSubmit={async (values: FormServiceSchema) => {
        const { price, ...rest } = values;
        const formatedPrice = transformMoneyToNumber(values?.price)

        if (!service) {
          const response = await dispatch(
            createServiceAsync({
              price: Number(formatedPrice),
              ...rest,
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show(response?.payload?.message, 3000, {
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
            updateServiceByIdAsync({
              serviceId: service?.id,
              data: {
                price: Number(formatedPrice),
                ...rest,
              },
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show(response?.payload?.messsage, 3000, {
              backgroundColor: "rgb(75,181,67)",
              textColor: "white",
            });
            setIsModalOpen(false);
          }

          if (response.meta.requestStatus == "rejected") {
            Toast.show(response?.payload as string, 3000, {
              backgroundColor: "#FF9494",
              textColor: "white",
            });
          }
        }
      }}
    >
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <StyledView className="w-[90%] mx-auto my-5 flex flex-col">
          <StyledView className="flex flex-col gap-y-3">
            <StyledView className="flex flex-col gap-y-1">
              <StyledView className="flex flex-col gap-y-1">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Nome
                </StyledText>
                <StyledTextInput
                  onChangeText={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values?.name}
                  placeholder={errors.name ? errors.name : "Type the title"}
                  placeholderTextColor={
                    errors.name ? "rgb(127 29 29)" : "rgb(156 163 175)"
                  }
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.name
                      ? "bg-red-50  border-[2px] border-red-900"
                      : "bg-gray-ligth"
                  }`}
                />
              </StyledView>
              <StyledView className="flex flex-col gap-y-2">
                <StyledText className="text-custom-gray text-[14px] font-semibold">
                  Valor
                </StyledText>
                <StyledTextInputMask
                  onFocus={(e) => e.stopPropagation()}
                  className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                    errors.price
                      ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                      : "bg-gray-ligth"
                  }`}
                  type="money"
                  options={{
                    maskType: "BRL",
                  }}
                  onChangeText={handleChange("price")}
                  onBlur={handleBlur("price")}
                  value={String(Number(values?.price) * 100)}
                />
                {errors?.price && errors?.price.toString() != "Required" && (
                  <StyledText className="text-red-700 font-semibold">
                    {errors?.price?.toString()}
                  </StyledText>
                )}
              </StyledView>
            </StyledView>
          </StyledView>
          <StyledPressable
            onPress={() => {
              handleSubmit();
            }}
            className="bg-gray-ligth flex justify-center items-center py-3 mt-5 rounded-md"
          >
            <StyledText className="font-bold text-custom-white">
              {service ? "Atualizar" : "Criar"}
            </StyledText>
          </StyledPressable>
        </StyledView>
      )}
    </Formik>
  );
}
