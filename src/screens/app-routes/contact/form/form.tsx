import { Formik } from "formik";
import { ContactType } from "type";
import Toast from "react-native-simple-toast";
import { Venue } from "@store/venue/venueSlice";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { toFormikValidationSchema } from "zod-formik-adapter";
import {
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledTextInputMask,
  StyledView,
} from "styledComponents";
import { createContactSchema } from "@schemas/contact/create-contact-params-schema";
import {
  createContactAsync,
  updateContactByIdAsync,
} from "@store/contact/contact-slice";
import { ActivityIndicator } from "react-native";

interface ContactFormProps {
  contact?: ContactType;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ContactFormComponent({
  contact,
  setIsModalOpen,
}: ContactFormProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.contactList.error
  );

  const venue: Venue = useSelector((state: RootState) => state.venueList.venue);

  const loading: boolean = useSelector(
    (state: RootState) => state.contactList.loading
  );

  return (
    <Formik
      validationSchema={toFormikValidationSchema(createContactSchema)}
      initialValues={{
        venueId: venue.id,
        id: contact?.id && contact.id,
        name: contact?.name && contact.name,
        role: contact?.role && contact.role,
        whatsapp: contact?.whatsapp && contact.whatsapp,
      }}
      validate={(values) => {
        try {
          createContactSchema.parse(values);
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
      onSubmit={async (values: ContactType) => {
        if (!contact) {
          const response = await dispatch(createContactAsync(values));

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Contato criado com sucesso." as string, 3000, {
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
            updateContactByIdAsync({
              contactId: contact.id,
              data: { ...values },
            })
          );

          if (response.meta.requestStatus == "fulfilled") {
            Toast.show("Contato atualizada com sucesso." as string, 3000, {
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
      {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
        <StyledView className="w-[90%] mx-auto mt-5  flex flex-col">
          <StyledView className="flex flex-col gap-y-3">
            <StyledView className="flex flex-col gap-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Name
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("name")}
                onBlur={handleBlur("name")}
                value={values.name}
                placeholder={errors.name ? errors.name : "Digite pergunta"}
                placeholderTextColor={
                  errors.name ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.name
                    ? "bg-red-50  border-[2px] border-red-900"
                    : "bg-gray-ligth"
                }`}
              />
            </StyledView>
            <StyledView className="flex flex-col gap-y-2">
              <StyledText className="text-custom-gray text-[14px] font-semibold">
                Funcao
              </StyledText>
              <StyledTextInput
                onChangeText={handleChange("role")}
                onBlur={handleBlur("role")}
                value={values.role}
                placeholder={errors.role ? errors.role : "Digite a resposta"}
                placeholderTextColor={
                  errors.role ? "rgb(127 29 29)" : "rgb(156 163 175)"
                }
                className={`rounded-md px-3 py-1 text-white ${
                  errors.role
                    ? "bg-red-50 border-[2px] border-red-900 "
                    : "bg-gray-ligth"
                }`}
              />
            </StyledView>
          </StyledView>
          <StyledView className="flex flex-col gap-y-2 mt-2">
            <StyledText className="text-custom-gray text-[14px] font-semibold">
              Whatsapp
            </StyledText>
            <StyledTextInputMask
              onFocus={(e) => e.stopPropagation()}
              className={`bg-gray-ligth rounded-md px-3 py-1 text-white ${
                errors.whatsapp
                  ? "bg-red-50  border-[2px] border-red-900 text-red-800"
                  : "bg-gray-ligth"
              }`}
              type="cel-phone"
              placeholder={
                errors.whatsapp
                  ? errors.whatsapp.toString()
                  : "Digite o whatsapp do cliente..."
              }
              placeholderTextColor={
                errors.whatsapp ? "rgb(127 29 29)" : "rgb(156 163 175)"
              }
              options={{
                maskType: "BRL",
                withDDD: true,
                dddMask: "(99) ",
              }}
              onChangeText={handleChange("whatsapp")}
              onBlur={handleBlur("whatsapp")}
              value={values.whatsapp}
            />
          </StyledView>
          <StyledPressable
            onPress={() => {
              handleSubmit();
            }}
            className="bg-green-800 flex justify-center items-center py-3 mt-5 rounded-md"
          >
            <StyledText className="font-bold text-custom-white">
              {loading ? (
                <ActivityIndicator size="small" color="#faebd7" />
              ) : (
                <StyledText className="font-bold text-custom-white">
                  {contact ? "Atualizar" : "Cadastrar"}
                </StyledText>
              )}
            </StyledText>
          </StyledPressable>
        </StyledView>
      )}
    </Formik>
  );
}
