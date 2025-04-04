import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { View, Text, ActivityIndicator, Image } from "react-native";
import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledText,
  StyledTextInput,
  StyledView,
} from "styledComponents";
import { User } from "@store/auth/authSlice";
import {
  createUserOrganizationAsync,
  deleteUserOrganizationByIdAsync,
  fecthUserOrganizationByOrganizationId,
  updateUserOrganizationAsync,
} from "@store/userOrganization/user-organization--slice";
import { Organization } from "@store/organization/organizationSlice";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";
import { fecthUsers } from "@store/userList/user-list-slice";
import { Entypo, Feather, FontAwesome5 } from "@expo/vector-icons";
import { undefined } from "zod";
import {
  fecthUserOrganizationVenues,
  fecthVenues,
  Venue,
} from "@store/venue/venueSlice";
import { VenuePermissionFlatList } from "../venues-permission-list";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import {
  createUserPermissionAsync,
  fecthUserPermission,
  updateUserPermission,
  updateUserPermissionAsync,
} from "@store/user-permission/user-permission-slice";
import { UserPermissionType } from "type";
import {
  CreateUserPermissionRequestParams,
  createUserPermissionSchema,
} from "@schemas/user-permission/create-user-permission-params-schema";
import {
  Permissions,
  userEditPermissions,
  userProposalPermissions,
  userViewPermissions,
} from "const/permissions";

interface UserOrganizationFormModalComponentProps {
  venueId?: string;
  isModalOpen: boolean;
  setMenuModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormSection: React.Dispatch<
    React.SetStateAction<"USER" | "VENUE" | "NEW_USER">
  >;
}

export default function UserOrganizationFormCreateModalComponent({
  venueId,
  isModalOpen,
  setFormSection,
  setMenuModalIsOpen,
}: UserOrganizationFormModalComponentProps) {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(
    (state: RootState) => state.userOrganizationList.loading
  );

  const userOrganization = useSelector(
    (state: RootState) => state.userOrganizationList.userOrganization
  );

  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );

  const user : User = useSelector(
    (state: RootState) => state?.userList.selectedUser
  );

  const [permissions, setPermissions] = useState<string[]>([]);

  const togglePermission = (permission: string) => {
    setPermissions((prev: string[]) =>
      prev?.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };
  const queryParams = new URLSearchParams();

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
      <StyledView className="h-full w-full bg-gray-dark  px-3">
        <Formik
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={toFormikValidationSchema(
            createUserPermissionSchema
          )}
          initialValues={{
            venueId: venueId || "",
            role: "",
            organizationId: organization.id,
            userId: user?.id || userOrganization.user.id,
            permissions: [],
          }}
          validate={(values) => {
            try {
              createUserPermissionSchema.safeParse(values);
              return {};
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
          onSubmit={async (values: CreateUserPermissionRequestParams) => {
            const response = await dispatch(createUserPermissionAsync(values));

            if (response.meta.requestStatus == "fulfilled") {
              Toast.show(
                "Permissao de usuario cadastrada com sucesso." as string,
                3000,
                {
                  backgroundColor: "rgb(75,181,67)",
                  textColor: "white",
                }
              );
              queryParams.append("organizationdId", organization?.id);
              await dispatch(
                fecthUserOrganizationByOrganizationId(
                  `${queryParams.toString()}`
                )
              );
              setMenuModalIsOpen(false);
              setFormSection("USER");
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
              if (values.role === "ADMIN") {
                setPermissions([
                  ...userViewPermissions.map((p) => p.enum),
                  ...userEditPermissions.map((p) => p.enum),
                  ...userProposalPermissions.map((p) => p.enum),
                ]);
              }
            }, [values.role]);

            return (
              <StyledView className="max-h-[90vh] w-full mx-auto my-5 flex flex-col gap-4 mt-10">
                <StyledScrollView className="max-h-[100vh] relative">
                  <StyledView
                    className={`w-full flex flex-col gap-y-1 mt-3  text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap mb-4`}
                  >
                    <StyledText className="font-semibold text-custom-gray text-[14px]">
                      Qual a funcao do novo usuario?
                    </StyledText>
                    <StyledView className="flex flex-row pt-3 gap-x-1">
                      <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                        <StyledPressable
                          className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                          onPress={() => {
                            setFieldValue("role", "ADMIN");
                          }}
                        >
                          <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                            {getFieldMeta("role").value === "ADMIN" && (
                              <Entypo name="check" size={12} color="white" />
                            )}
                          </StyledView>
                          <StyledText className="text-custom-gray text-[14px] font-semibold">
                            Admin
                          </StyledText>
                        </StyledPressable>
                      </StyledView>
                      <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                        <StyledPressable
                          className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                          onPress={() => setFieldValue("role", "USER")}
                        >
                          <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
                            {getFieldMeta("role").value === "USER" && (
                              <Entypo name="check" size={12} color="white" />
                            )}
                          </StyledView>
                          <StyledText className="text-custom-gray text-[14px] font-semibold">
                            Usuario
                          </StyledText>
                        </StyledPressable>
                      </StyledView>
                    </StyledView>
                  </StyledView>
                  <StyledText className="text-custom-gray text-[14px] font-semibold mb-4">
                    Permissoes de Visualizacao :
                  </StyledText>
                  {userViewPermissions.map(
                    (
                      item: { enum: Permissions; display: string },
                      index: number
                    ) => {
                      return (
                        <StyledView
                          className="flex flex-row justify-between items-start w-full"
                          key={index}
                        >
                          <StyledText className="text-custom-gray text-[12px] font-semibold mb-4">
                            {item.display}
                          </StyledText>
                          <StyledView>
                            <StyledPressable
                              className={`
                                w-5 h-5 border-[1px] border-gray-500 cursor-pointer
                                flex justify-center items-center rounded-full
                              ${
                                permissions?.includes(item.enum)
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }
                              `}
                              onPress={() => togglePermission(item.enum)}
                            >
                              {permissions?.includes(item.enum) && (
                                <Entypo name="check" size={14} color="white" />
                              )}
                            </StyledPressable>
                          </StyledView>
                        </StyledView>
                      );
                    }
                  )}
                  <StyledText className="text-custom-gray text-[14px] font-semibold mb-4">
                    Permissoes de Edicao :
                  </StyledText>
                  {userEditPermissions.map(
                    (
                      item: { enum: Permissions; display: string },
                      index: number
                    ) => {
                      return (
                        <StyledView
                          className="flex flex-row justify-between items-start w-full"
                          key={index}
                        >
                          <StyledText className="text-custom-gray text-[12px] font-semibold mb-4">
                            {item.display}
                          </StyledText>
                          <StyledView>
                            <StyledPressable
                              className={`w-5 h-5 border-[1px] border-gray-500 cursor-pointer
                                flex justify-center items-center rounded-full
                              ${
                                permissions?.includes(item.enum)
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                              onPress={() => togglePermission(item.enum)}
                            >
                              {permissions?.includes(item.enum) && (
                                <Entypo name="check" size={14} color="white" />
                              )}
                            </StyledPressable>
                          </StyledView>
                        </StyledView>
                      );
                    }
                  )}
                  <StyledText className="text-custom-gray text-[14px] font-semibold mb-4">
                    Permissoes de Eventos / Orcamentos :
                  </StyledText>
                  {userProposalPermissions.map(
                    (
                      item: { enum: Permissions; display: string },
                      index: number
                    ) => {
                      return (
                        <StyledView
                          className="flex flex-row justify-between items-start w-full"
                          key={index}
                        >
                          <StyledText className="text-custom-gray text-[12px] font-semibold mb-4">
                            {item.display}
                          </StyledText>
                          <StyledView>
                            <StyledPressable
                              className={`w-5 h-5 border-[1px] border-gray-500 cursor-pointer
                                flex justify-center items-center rounded-full
                              ${
                                permissions?.includes(item.enum)
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                              onPress={() => togglePermission(item.enum)}
                            >
                              {permissions?.includes(item.enum) && (
                                <Entypo name="check" size={14} color="white" />
                              )}
                            </StyledPressable>
                          </StyledView>
                        </StyledView>
                      );
                    }
                  )}
                  <StyledPressable
                    onPress={async () => {
                      await setFieldValue("permissions", permissions);
                      handleSubmit();
                    }}
                    className="bg-green-800 flex justify-center items-center py-3 mt-5 rounded-md"
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <StyledText className="font-bold text-custom-white">
                        Cadastrar
                      </StyledText>
                    )}
                  </StyledPressable>
                </StyledScrollView>
              </StyledView>
            );
          }}
        </Formik>
      </StyledView>
    </StyledModal>
  );
}

{
  /* <StyledView className="pt-3">
<StyledText className="text-custom-gray text-[14px] font-semibold">
  Tipo de Usuario:
</StyledText>
<StyledView className="flex justify-start items-start flex-row py-2 mt-1">
  <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
    <StyledPressable
      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
      onPress={() => {
        setFieldValue("role", "ADMIN");
      }}
    >
      <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
        {getFieldMeta("role").value === "ADMIN" && (
          <Entypo name="check" size={12} color="white" />
        )}
      </StyledView>
      <StyledText className="text-custom-gray  text-[13px] font-semibold">
        Administrador
      </StyledText>
    </StyledPressable>
  </StyledView>
  <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
    <StyledPressable
      className="flex flex-row items-center justify-center gap-x-2 cursor-pointer "
      onPress={() => {
        setFieldValue("role", "USER");
      }}
    >
      <StyledView className="w-4 h-4 border-[1px] border-gray-500 cursor-pointer brightness-75 flex justify-center items-center">
        {getFieldMeta("role").value === "USER" && (
          <Entypo name="check" size={12} color="white" />
        )}
      </StyledView>
      <StyledText className="text-custom-gray  text-[13px] font-semibold">
        Usuario
      </StyledText>
    </StyledPressable>
  </StyledView>
</StyledView>
</StyledView>
</StyledView>
<StyledView>
<StyledText className="text-custom-gray text-[14px] font-semibold ">
Permissões Para Visualizacoes:
</StyledText>

<StyledView className="flex flex-wrap justify-between items-start gap-2 mt-2 w-full ">
{userViewPermissions.map((permission, index) => (
  <StyledView
    key={permission.enum}
    className="flex flex-row items-center justify-between gap-x-2 w-full"
  >
    <StyledText className="text-custom-gray text-[13px]">
      {permission.display}
    </StyledText>
    <StyledPressable
      className="w-4 h-4 border-[1px] border-gray-500 flex justify-center items-center"
      onPress={() => {
        setFieldValue(
          "venuesPermissions",
          (prev: string[]) => {
            // Verifica se a permissão já está na lista
            return prev.includes(permission.enum)
              ? prev.filter((p) => p !== permission.enum) // Remove se já estiver
              : [...prev, permission.enum]; // Adiciona se não estiver
          }
        );
      }}
    >
      {Array.isArray(
        getFieldMeta("venuesPermissions").value
      ) &&
        getFieldMeta("venuesPermissions").value.includes(
          permission.enum
        ) && <Entypo name="check" size={12} color="white" />}
    </StyledPressable>
  </StyledView>
))}
</StyledView>
</StyledView>
<StyledView>
<StyledText className="text-custom-gray text-[14px] font-semibold">
Permissões Para Edicao:
</StyledText>
<StyledView className="flex flex-wrap justify-between items-start gap-2 mt-2 w-full">
{userEditPermissions.map((permission, index) => (
  <StyledView
    key={permission.enum}
    className="flex flex-row items-center justify-between gap-x-2 w-full"
  >
    <StyledText className="text-custom-gray text-[13px]">
      {permission.display}
    </StyledText>
    <StyledPressable
      className="w-4 h-4 border border-gray-500 flex justify-center items-center"
      onPress={() => {
        setFieldValue(
          "venuesPermissions",
          (prev: string[] = []) => {
            // Verifica se a permissão já está na lista
            return prev.includes(permission.enum)
              ? prev.filter((p) => p !== permission.enum) // Remove se já estiver
              : [...prev, permission.enum]; // Adiciona se não estiver
          }
        );
      }}
    >
      {values.venuesPermissions?.includes(
        permission?.enum
      ) && <Entypo name="check" size={12} color="white" />}
    </StyledPressable>
  </StyledView>
))}
</StyledView> */
}
