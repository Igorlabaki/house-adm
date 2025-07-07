import {
  View,
  Text,
  ActivityIndicator,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledTextInput,
  StyledView,
  StyledTextInputMask,
} from "styledComponents";
import { Formik } from "formik";
import { toFormikValidationSchema } from "zod-formik-adapter";
import Toast from "react-native-simple-toast";
import FlashMessage, { showMessage } from "react-native-flash-message";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { createOrganizationFormSchema } from "@schemas/organization/createOrganizationZodSchema";
import {
  createOrganizationAsync,
  Organization,
  updateOrganizationAsync,
} from "@store/organization/organizationSlice";
import CountryPicker, {
  Country,
  getAllCountries,
} from "react-native-country-picker-modal";
import COUNTRIES from "react-native-country-picker-modal";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { MaterialIcons } from "@expo/vector-icons";

interface OrganizationFormModalComponentProps {
  isModalOpen: boolean;
  organization?: Organization;
  setMenuModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// Lista local dos principais países
const MAIN_COUNTRIES = [
  { cca2: "BR", callingCode: ["55"], name: "Brazil" },
  { cca2: "US", callingCode: ["1"], name: "United States" },
  { cca2: "PT", callingCode: ["351"], name: "Portugal" },
  { cca2: "GB", callingCode: ["44"], name: "United Kingdom" },
  { cca2: "DE", callingCode: ["49"], name: "Germany" },
  { cca2: "FR", callingCode: ["33"], name: "France" },
  { cca2: "ES", callingCode: ["34"], name: "Spain" },
  { cca2: "IT", callingCode: ["39"], name: "Italy" },
  { cca2: "AR", callingCode: ["54"], name: "Argentina" },
  { cca2: "MX", callingCode: ["52"], name: "Mexico" },
  { cca2: "CA", callingCode: ["1"], name: "Canada" },
  { cca2: "RU", callingCode: ["7"], name: "Russia" },
  { cca2: "CN", callingCode: ["86"], name: "China" },
  { cca2: "JP", callingCode: ["81"], name: "Japan" },
  { cca2: "IN", callingCode: ["91"], name: "India" },
  { cca2: "AU", callingCode: ["61"], name: "Australia" },
  { cca2: "ZA", callingCode: ["27"], name: "South Africa" },
  { cca2: "TR", callingCode: ["90"], name: "Turkey" },
  { cca2: "KR", callingCode: ["82"], name: "South Korea" },
  { cca2: "CL", callingCode: ["56"], name: "Chile" },
  { cca2: "CO", callingCode: ["57"], name: "Colombia" },
  { cca2: "NL", callingCode: ["31"], name: "Netherlands" },
  { cca2: "BE", callingCode: ["32"], name: "Belgium" },
  { cca2: "SE", callingCode: ["46"], name: "Sweden" },
  { cca2: "NO", callingCode: ["47"], name: "Norway" },
  { cca2: "DK", callingCode: ["45"], name: "Denmark" },
  { cca2: "FI", callingCode: ["358"], name: "Finland" },
  { cca2: "CH", callingCode: ["41"], name: "Switzerland" },
  { cca2: "IE", callingCode: ["353"], name: "Ireland" },
  { cca2: "PL", callingCode: ["48"], name: "Poland" },
  { cca2: "GR", callingCode: ["30"], name: "Greece" },
  { cca2: "AT", callingCode: ["43"], name: "Austria" },
  { cca2: "IL", callingCode: ["972"], name: "Israel" },
  { cca2: "EG", callingCode: ["20"], name: "Egypt" },
  { cca2: "UA", callingCode: ["380"], name: "Ukraine" },
  { cca2: "TH", callingCode: ["66"], name: "Thailand" },
  { cca2: "ID", callingCode: ["62"], name: "Indonesia" },
  { cca2: "NZ", callingCode: ["64"], name: "New Zealand" },
  { cca2: "PK", callingCode: ["92"], name: "Pakistan" },
  { cca2: "NG", callingCode: ["234"], name: "Nigeria" },
  { cca2: "SA", callingCode: ["966"], name: "Saudi Arabia" },
  { cca2: "KR", callingCode: ["82"], name: "South Korea" },
  { cca2: "SG", callingCode: ["65"], name: "Singapore" },
  { cca2: "AE", callingCode: ["971"], name: "United Arab Emirates" },
  { cca2: "CZ", callingCode: ["420"], name: "Czech Republic" },
  { cca2: "HU", callingCode: ["36"], name: "Hungary" },
  { cca2: "RO", callingCode: ["40"], name: "Romania" },
  { cca2: "MY", callingCode: ["60"], name: "Malaysia" },
  { cca2: "PH", callingCode: ["63"], name: "Philippines" },
];

// Função utilitária fora do componente
async function splitPhoneNumber(fullNumber: string) {
  if (!fullNumber)
    return { countryCode: "BR", callingCode: "55", localNumber: "" };
  const countries = MAIN_COUNTRIES;
  const sorted = countries
    .filter((c) => c.callingCode && c.callingCode.length > 0)
    .sort((a, b) => b.callingCode[0].length - a.callingCode[0].length);
  for (const country of sorted) {
    const code = country.callingCode[0];
    if (fullNumber.startsWith(code)) {
      return {
        countryCode: country.cca2,
        callingCode: code,
        localNumber: fullNumber.slice(code.length),
      };
    }
  }
  return { countryCode: "BR", callingCode: "55", localNumber: fullNumber };
}

export default function OrganizationFormModalComponent({
  isModalOpen,
  organization,
  setMenuModalIsOpen,
}: OrganizationFormModalComponentProps) {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(
    (state: RootState) => state.userOrganizationList.loading
  );

  const error = useSelector((state: RootState) => state.organizationList.error);

  const user = useSelector((state: RootState) => state.session.user);
  const queryParams = new URLSearchParams();

  const [logoName, setLogoName] = useState<string>("");
  const [country, setCountry] = useState<Country | undefined>(undefined);
  const [callingCode, setCallingCode] = useState("55");
  const [localNumber, setLocalNumber] = useState("");

  useEffect(() => {
    async function initPhone() {
      const { countryCode, callingCode, localNumber } = await splitPhoneNumber(
        organization?.whatsappNumber || ""
      );
      setCountry({ cca2: countryCode, callingCode: [callingCode] } as any);
      setCallingCode(callingCode);
      setLocalNumber(localNumber);
    }
    initPhone();
  }, [organization]);

  useEffect(() => {
    queryParams.append("userId", user?.id);
  }, [user]);

  return (
    <StyledModal
      visible={isModalOpen}
      transparent={true}
      onRequestClose={() => {
        setMenuModalIsOpen(false);
      }}
      animationType="slide"
      pointerEvents="box-none"
    >
      <StyledView className="h-full w-full bg-eventhub-background mx-auto px-3">
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={toFormikValidationSchema(
            createOrganizationFormSchema
          )}
          initialValues={{
            name: (organization?.name && organization?.name) || "",
            email: (organization?.email && organization?.email) || "",
            whatsappNumber: localNumber,
            tiktokUrl:
              (organization?.tikTokUrl && organization?.tikTokUrl) || "",
            instagramUrl:
              (organization?.instagramUrl && organization?.instagramUrl) || "",
            url: (organization?.url && organization?.url) || "",
            facebookUrl:
              (organization?.facebookUrl && organization?.facebookUrl) || "",
            logoFile: organization?.logoUrl || "",
          }}
          validate={(values) => {
            try {
              createOrganizationFormSchema.parse(values);
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
          onSubmit={async (values: {
            name: string;
            email: string;
            whatsappNumber?: string;
            tiktokUrl?: string;
            instagramUrl?: string;
            url?: string;
            facebookUrl?: string;
            logoFile?: string;
          }) => {
            if (organization?.name) {
              const response = await dispatch(
                updateOrganizationAsync({
                  name: values?.name,
                  email: values?.email,
                  whatsappNumber: values?.whatsappNumber || undefined,
                  tiktokUrl: values?.tiktokUrl || undefined,
                  instagramUrl: values?.instagramUrl || undefined,
                  url: values?.url || undefined,
                  facebookUrl: values?.facebookUrl || undefined,
                  logoFile: values?.logoFile || undefined,
                  organizationId: organization.id,
                })
              );

              if (response.meta.requestStatus == "fulfilled") {
                Toast.show(
                  "Organizacao atualizada com sucesso." as string,
                  3000,
                  {
                    backgroundColor: "rgb(75,181,67)",
                    textColor: "white",
                  }
                );
                setMenuModalIsOpen(false);
              }

              if (response.meta.requestStatus == "rejected") {
                Toast.show(response.payload as string, 3000, {
                  backgroundColor: "#FF9494",
                  textColor: "white",
                });
              }

              return;
            }

            const response = await dispatch(
              createOrganizationAsync({
                userId: user.id,
                name: values?.name,
                email: values?.email,
                whatsappNumber: values?.whatsappNumber || undefined,
                tiktokUrl: values?.tiktokUrl || undefined,
                instagramUrl: values?.instagramUrl || undefined,
                url: values?.url || undefined,
                facebookUrl: values?.facebookUrl || undefined,
                logoFile: values?.logoFile || undefined,
              })
            );

            if (response.meta.requestStatus == "fulfilled") {
              Toast.show("Organizacao criada com sucesso." as string, 3000, {
                backgroundColor: "rgb(75,181,67)",
                textColor: "white",
              });
              setMenuModalIsOpen(false);
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
            ...rest
          }: {
            handleChange: any;
            handleBlur: any;
            handleSubmit: any;
            values: {
              name: string;
              email: string;
              whatsappNumber?: string;
              tiktokUrl?: string;
              instagramUrl?: string;
              url?: string;
              facebookUrl?: string;
              logoFile?: string;
            };
            errors: any;
            getFieldMeta: any;
            setFieldValue: any;
            resetForm: any;
          }) => {
            useEffect(() => {
              if (localNumber) {
                setFieldValue("whatsappNumber", localNumber);
              }
            }, [localNumber]);

            const pickLogo = async () => {
              const permissionResult =
                await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (!permissionResult.granted) {
                Toast.show(
                  "Permissão para acessar as fotos é necessária!",
                  3000,
                  {
                    backgroundColor: "rgb(75,181,67)",
                    textColor: "white",
                  }
                );
                return;
              }
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
              });
              if (!result.canceled) {
                const imageUri = result.assets[0].uri;
                const fileName = imageUri.split("/").pop() || "logo";
                setFieldValue("logoFile", imageUri);
                setLogoName(fileName);
              }
            };
            return (
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ paddingBottom: 32 }}
              >
                <StyledView className=" w-full mx-auto my-5 flex flex-col gap-y-4 mt-3">
                  <StyledView className="flex flex-col gap-y-1">
                    <StyledText className="text-eventhub-text text-[14px] font-semibold">
                      Nome *
                    </StyledText>
                    <StyledTextInput
                      onChangeText={handleChange("name")}
                      onBlur={handleBlur("name")}
                      value={values?.name || ""}
                      placeholder={
                        errors.name
                          ? String(errors.name)
                          : "Digite o nome da organização"
                      }
                      placeholderTextColor={
                        errors.name ? "rgb(127 29 29)" : "rgb(156 163 175)"
                      }
                      className={`rounded-md px-3 py-1 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${
                        errors.name
                          ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                          : "bg-white"
                      }`}
                    />
                  </StyledView>

                  <StyledView className="flex flex-col gap-y-1">
                    <StyledText className="text-eventhub-text text-[14px] font-semibold">
                      Email *
                    </StyledText>
                    <StyledTextInput
                      onChangeText={handleChange("email")}
                      onBlur={handleBlur("email")}
                      value={values?.email || ""}
                      placeholder={
                        errors.email ? String(errors.email) : "Digite o email"
                      }
                      placeholderTextColor={
                        errors.email ? "rgb(127 29 29)" : "rgb(156 163 175)"
                      }
                      className={`rounded-md px-3 py-1 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${
                        errors.email
                          ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                          : "bg-white"
                      }`}
                    />
                  </StyledView>

                  <StyledView className="flex flex-col gap-y-1">
                    <StyledText className="text-eventhub-text text-[14px] font-semibold">
                      WhatsApp
                    </StyledText>
                    <StyledView
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        borderRadius: 6,
                        backgroundColor: "#fff",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <CountryPicker
                        countryCode={country?.cca2 || "BR"}
                        withFilter
                        withFlag
                        withCallingCode
                        withEmoji
                        onSelect={setCountry}
                        translation="por"
                        containerButtonStyle={{ marginRight: 4 }}
                      />
                      <StyledText
                        style={{
                          color: "#1f2937",
                          fontWeight: "600",
                          marginRight: 6,
                        }}
                      >
                        +{country?.callingCode?.[0] || "55"}
                      </StyledText>
                      <StyledTextInputMask
                        type={"custom"}
                        options={{
                          mask:
                            (country?.cca2 || "BR") === "BR"
                              ? "(99) 99999-9999"
                              : "999999999999",
                        }}
                        value={values.whatsappNumber || ""}
                        onChangeText={(text) => {
                          const onlyNumbers = text.replace(/\D/g, "");
                          setFieldValue("whatsappNumber", onlyNumbers);
                        }}
                        placeholder="Digite o número"
                        placeholderTextColor="rgb(156 163 175)"
                        keyboardType="phone-pad"
                        style={{
                          flex: 1,
                          color: "#1f2937",
                          fontWeight: "600",
                          backgroundColor: "transparent",
                          borderWidth: 0,
                          paddingVertical: 8,
                          paddingHorizontal: 0,
                        }}
                      />
                    </StyledView>
                  </StyledView>

                  <StyledView className="flex flex-col gap-y-1">
                    <StyledText className="text-eventhub-text text-[14px] font-semibold">
                      URL do TikTok
                    </StyledText>
                    <StyledTextInput
                      onChangeText={handleChange("tiktokUrl")}
                      onBlur={handleBlur("tiktokUrl")}
                      value={values?.tiktokUrl || ""}
                      placeholder={
                        errors.tiktokUrl
                          ? String(errors.tiktokUrl)
                          : "Digite a URL do TikTok"
                      }
                      placeholderTextColor={
                        errors.tiktokUrl ? "rgb(127 29 29)" : "rgb(156 163 175)"
                      }
                      className={`rounded-md px-3 py-1 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${
                        errors.tiktokUrl
                          ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                          : "bg-white"
                      }`}
                    />
                  </StyledView>

                  <StyledView className="flex flex-col gap-y-1">
                    <StyledText className="text-eventhub-text text-[14px] font-semibold">
                      URL do Instagram
                    </StyledText>
                    <StyledTextInput
                      onChangeText={handleChange("instagramUrl")}
                      onBlur={handleBlur("instagramUrl")}
                      value={values?.instagramUrl || ""}
                      placeholder={
                        errors.instagramUrl
                          ? String(errors.instagramUrl)
                          : "Digite a URL do Instagram"
                      }
                      placeholderTextColor={
                        errors.instagramUrl
                          ? "rgb(127 29 29)"
                          : "rgb(156 163 175)"
                      }
                      className={`rounded-md px-3 py-1 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${
                        errors.instagramUrl
                          ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                          : "bg-white"
                      }`}
                    />
                  </StyledView>

                  <StyledView className="flex flex-col gap-y-1">
                    <StyledText className="text-eventhub-text text-[14px] font-semibold">
                      URL do Facebook
                    </StyledText>
                    <StyledTextInput
                      onChangeText={handleChange("facebookUrl")}
                      onBlur={handleBlur("facebookUrl")}
                      value={values?.facebookUrl || ""}
                      placeholder={
                        errors.facebookUrl
                          ? String(errors.facebookUrl)
                          : "Digite a URL do Facebook"
                      }
                      placeholderTextColor={
                        errors.facebookUrl
                          ? "rgb(127 29 29)"
                          : "rgb(156 163 175)"
                      }
                      className={`rounded-md px-3 py-1 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${
                        errors.facebookUrl
                          ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                          : "bg-white"
                      }`}
                    />
                  </StyledView>

                  <StyledView className="flex flex-col gap-y-1">
                    <StyledText className="text-eventhub-text text-[14px] font-semibold">
                      URL do Site
                    </StyledText>
                    <StyledTextInput
                      onChangeText={handleChange("url")}
                      onBlur={handleBlur("url")}
                      value={values?.url || ""}
                      placeholder={
                        errors.url ? String(errors.url) : "Digite a URL do site"
                      }
                      placeholderTextColor={
                        errors.url ? "rgb(127 29 29)" : "rgb(156 163 175)"
                      }
                      className={`rounded-md px-3 py-1 text-gray-800 font-semibold border-[1px] border-gray-200 focus:border-[1.5px] focus:border-eventhub-secondary  ${
                        errors.url
                          ? "bg-red-50  border-[2px] border-red-900 text-gray-ligth"
                          : "bg-white"
                      }`}
                    />
                  </StyledView>

                  <StyledView
                    className="flex flex-col gap-y-1"
                    style={{ marginBottom: 16 }}
                  >
                    <StyledText
                      className="text-eventhub-text text-[14px] font-semibold"
                      style={{ marginBottom: 4 }}
                    >
                      Logo do Espaço
                    </StyledText>
                    <TouchableOpacity
                      onPress={pickLogo}
                      style={{
                        borderWidth: 1,
                        borderColor: "#e5e7eb",
                        borderRadius: 6,
                        padding: 10,
                        backgroundColor: "#f9fafb",
                        flexDirection: "row",
                        alignItems: "center",
                        marginBottom: 8,
                      }}
                    >
                      <Text style={{ color: "#2563eb", fontWeight: "bold" }}>
                        Escolher ficheiro
                      </Text>
                      {logoName ? (
                        <Text style={{ marginLeft: 8, color: "#374151" }}>
                          {logoName}
                        </Text>
                      ) : null}
                    </TouchableOpacity>
                    {values.logoFile || organization?.logoUrl ? (
                      <View
                        style={{
                          borderWidth: 1,
                          borderColor: "#e5e7eb",
                          borderRadius: 8,
                          padding: 4,
                          alignItems: "center",
                          backgroundColor: "#fff",
                        }}
                      >
                        <Image
                          source={{
                            uri: values.logoFile || organization?.logoUrl,
                          }}
                          style={{
                            width: 220,
                            height: 90,
                            borderRadius: 8,
                            resizeMode: "contain",
                          }}
                        />
                      </View>
                    ) : null}
                  </StyledView>

                  <StyledPressable
                    onPress={() => {
                      handleSubmit();
                    }}
                    className="bg-eventhub-primary  flex justify-center items-center py-3 mt-5 rounded-md"
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <StyledText className="font-bold text-custom-white">
                        {organization ? "Atualizar" : "Cadastrar"}
                      </StyledText>
                    )}
                  </StyledPressable>
                </StyledView>
              </ScrollView>
            );
          }}
        </Formik>
      </StyledView>
    </StyledModal>
  );
}
