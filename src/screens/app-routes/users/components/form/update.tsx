import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import { toFormikValidationSchema } from "zod-formik-adapter";
import { View, Text, ActivityIndicator, Image, Switch } from "react-native";
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
  deleteUserPermission,
  deleteUserPermissionByIdAsync,
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
import {
  UpdateUserPermissionRequestParams,
  updateUserPermissionSchema,
} from "@schemas/user-permission/update-user-permission-params-schema";

interface UserOrganizationFormModalComponentProps {
  isModalOpen: boolean;
  userPermission?: UserPermissionType;
  setMenuModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFormSection: React.Dispatch<
    React.SetStateAction<"USER" | "VENUE" | "NEW_USER" | "NEW_VENUE">
  >;
}

export default function UserOrganizationFormUpdateModalComponent({
  isModalOpen,
  userPermission,
  setFormSection,
  setMenuModalIsOpen,
}: UserOrganizationFormModalComponentProps) {
  const dispatch = useDispatch<AppDispatch>();

  const loading = useSelector(
    (state: RootState) => state.userOrganizationList.loading
  );

  const queryParams = new URLSearchParams();

  const selectedUser: User = useSelector(
    (state: RootState) => state.userList.selectedUser
  );

  const [modalVisible, setModalVisible] = useState(false);
  const handleDelete = () => {
    setModalVisible(true);
  };
  const [permissions, setPermissions] = useState<string[]>(
    userPermission?.permissions?.split(",") || []
  );

  const confirmDelete = async () => {
    const deleteItem = await dispatch(
      deleteUserPermissionByIdAsync(userPermission.id)
    );

    if (deleteItem.meta.requestStatus === "fulfilled") {
      Toast.show("Permissao deletada com sucesso." as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
      setFormSection("USER");
    }

    if (deleteItem.meta.requestStatus == "rejected") {
      Toast.show("Erro ao deletar" as string, 3000, {
        backgroundColor: "#FF9494",
        textColor: "white",
      });
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  const togglePermission = (permission: string) => {
    setPermissions((prev: string[]) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission]
    );
  };

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
      <StyledView className="h-full w-full bg-eventhub-background   px-3">
        <Formik
          enableReinitialize
          validateOnChange={false}
          validateOnBlur={false}
          validationSchema={toFormikValidationSchema(
            updateUserPermissionSchema
          )}
          initialValues={{
            venueId: userPermission?.venueId || "",
            role: userPermission?.role || "",
            userPermissionId: userPermission?.id,
            permissions: userPermission?.permissions?.split(",") || [],
          }}
          validate={(values) => {
            try {
              updateUserPermissionSchema.parse(values);
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
          onSubmit={async (values: UpdateUserPermissionRequestParams) => {
            const response = await dispatch(updateUserPermissionAsync(values));

            if (response.meta.requestStatus == "fulfilled") {
              Toast.show("Permissao atualizada com sucesso." as string, 3000, {
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
          }) => {
            return (
              <StyledView className="max-h-[90vh] w-full mx-auto my-5 flex flex-col gap-y-4 mt-10">
                <StyledScrollView className="max-h-[100vh] relative">
                  {userPermission && (
                    <StyledPressable
                      onPress={async () => handleDelete()}
                      className="absolute -top-0 right-2"
                    >
                      <Feather name="trash" size={16} color="white" />
                    </StyledPressable>
                  )}
                  <StyledView
                    className={`w-full flex flex-col gap-y-1 text-[12px] md:text-[15px] animate-openOpacity justify-center items-start  flex-wrap mb-4`}
                  >
                    <StyledText className="font-semibold text-gray-600 text-[14px]">
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
                          <StyledView
                            className={`w-4 h-4 border-[1px] rounded-full border-eventhub-primary cursor-pointer brightness-75 flex justify-center items-center ${
                              getFieldMeta("role").value === "ADMIN"
                                ? "bg-eventhub-primary"
                                : "bg-transparent"
                            }`}
                          />

                          <StyledText className="text-gray-600 text-[14px] font-semibold">
                            Admin
                          </StyledText>
                        </StyledPressable>
                      </StyledView>
                      <StyledView className="flex flex-wrap gap-1 text-sm font-light text-veryDarkGraishCyan  text-[12px] md:text-[15px]">
                        <StyledPressable
                          className="flex flex-row items-center justify-center gap-x-1 cursor-pointer "
                          onPress={() => setFieldValue("role", "USER")}
                        >
                             <StyledView
                            className={`w-4 h-4 border-[1.5px] rounded-full border-eventhub-primary cursor-pointer brightness-75 flex justify-center items-center ${
                              getFieldMeta("role").value === "USER"
                                ? "bg-eventhub-primary"
                                : "bg-transparent"
                            }`}
                          />
                          <StyledText className="text-gray-600 text-[14px] font-semibold">
                            Usuario
                          </StyledText>
                        </StyledPressable>
                      </StyledView>
                    </StyledView>
                  </StyledView>

                  <StyledView className="bg-[#f8faff] rounded-xl mb-6 shadow-lg border border-gray-200">
                    <StyledView className="flex-row py-3 px-5 bg-eventhub-primary rounded-t-xl border-b border-[#e5e7eb]">
                      <StyledText className="flex-1 text-white font-bold text-[15px]">
                      Permissões de Visualização
                      </StyledText>
                      <StyledText className="w-16 text-right text-white  font-bold text-[15px]">
                        Status
                      </StyledText>
                    </StyledView>
                    {userViewPermissions.map((item, index) => (
                      <StyledView
                        key={index}
                        className={`flex-row items-center py-3 px-5 bg-white ${
                          index !== userViewPermissions.length - 1
                            ? "border-b border-[#f0f3fa]"
                            : ""
                        }`}
                      >
                        <StyledText className="flex-1 text-gray-900 text-[15px]">
                          {item.display}
                        </StyledText>
                        <Switch
                          value={permissions?.includes(item.enum)}
                          onValueChange={() => togglePermission(item.enum)}
                          trackColor={{ false: "#d1d5db", true: "#6c47ff" }}
                          thumbColor={
                            permissions?.includes(item.enum)
                              ? "#fff"
                              : "#f4f3f4"
                          }
                        />
                      </StyledView>
                    ))}
                  </StyledView>
                  <StyledView className="bg-[#f8faff] rounded-xl mb-6 shadow-lg border border-gray-200">
                    <StyledView className="flex-row py-3 px-5 bg-eventhub-primary rounded-t-xl border-b border-[#e5e7eb]">
                      <StyledText className="flex-1 text-white font-bold text-[15px]">
                      Permissões de Edição
                      </StyledText>
                      <StyledText className="w-16 text-right text-white  font-bold text-[15px]">
                        Status
                      </StyledText>
                    </StyledView>
                    {userEditPermissions.map((item, index) => (
                      <StyledView
                        key={index}
                        className={`flex-row items-center py-3 px-5 bg-white ${
                          index !== userEditPermissions.length - 1
                            ? "border-b border-[#f0f3fa]"
                            : ""
                        }`}
                      >
                        <StyledText className="flex-1 text-gray-900 text-[15px]">
                          {item.display}
                        </StyledText>
                        <Switch
                          value={permissions?.includes(item.enum)}
                          onValueChange={() => togglePermission(item.enum)}
                          trackColor={{ false: "#d1d5db", true: "#6c47ff" }}
                          thumbColor={
                            permissions?.includes(item.enum)
                              ? "#fff"
                              : "#f4f3f4"
                          }
                        />
                      </StyledView>
                    ))}
                  </StyledView>

                  <StyledView className="bg-[#f8faff] rounded-xl mb-6 shadow-lg border border-gray-200">
                    <StyledView className="flex-row py-3 px-5 bg-eventhub-primary rounded-t-xl border-b border-[#e5e7eb]">
                      <StyledText className="flex-1 text-white font-bold text-[15px]">
                      Permissões de Eventos / Orçamentos
                      </StyledText>
                      <StyledText className="w-16 text-right text-white  font-bold text-[15px]">
                        Status
                      </StyledText>
                    </StyledView>
                    {userProposalPermissions.map((item, index) => (
                      <StyledView
                        key={index}
                        className={`flex-row items-center py-3 px-5 bg-white ${
                          index !== userProposalPermissions.length - 1
                            ? "border-b border-[#f0f3fa]"
                            : ""
                        }`}
                      >
                        <StyledText className="flex-1 text-gray-900 text-[15px]">
                          {item.display}
                        </StyledText>
                        <Switch
                          value={permissions?.includes(item.enum)}
                          onValueChange={() => togglePermission(item.enum)}
                          trackColor={{ false: "#d1d5db", true: "#6c47ff" }}
                          thumbColor={
                            permissions?.includes(item.enum)
                              ? "#fff"
                              : "#f4f3f4"
                          }
                        />
                      </StyledView>
                    ))}
                  </StyledView>
                  <StyledPressable
                    onPress={async () => {
                      await setFieldValue("permissions", permissions);
                      handleSubmit();
                    }}
                    className="
                    justify-center items-center bg-eventhub-primary active:scale-95
                    rounded-md px-4 flex flex-row  py-3 shadow-lg  mb-2 w-full border-[0.6px] border-white border-solid"
                    disabled={loading}
                  >
                    {loading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <StyledText className="font-bold text-custom-white">
                        {userPermission ? "Atualizar" : "Cadastrar"}
                      </StyledText>
                    )}
                  </StyledPressable>
                </StyledScrollView>
              </StyledView>
            );
          }}
        </Formik>
      </StyledView>
      <DeleteConfirmationModal
        entity="permissao"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}

{
  /* <StyledView className="pt-3">
<StyledText className="text-gray-600 text-[14px] font-semibold">
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
      <StyledText className="text-gray-600  text-[13px] font-semibold">
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
      <StyledText className="text-gray-600  text-[13px] font-semibold">
        Usuario
      </StyledText>
    </StyledPressable>
  </StyledView>
</StyledView>
</StyledView>
</StyledView>
<StyledView>
<StyledText className="text-gray-600 text-[14px] font-semibold ">
Permissões Para Visualizacoes:
</StyledText>

<StyledView className="flex flex-wrap justify-between items-start gap-2 mt-2 w-full ">
{userViewPermissions.map((permission, index) => (
  <StyledView
    key={permission.enum}
    className="flex flex-row items-center justify-between gap-x-2 w-full"
  >
    <StyledText className="text-gray-600 text-[13px]">
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
<StyledText className="text-gray-600 text-[14px] font-semibold">
Permissões Para Edicao:
</StyledText>
<StyledView className="flex flex-wrap justify-between items-start gap-2 mt-2 w-full">
{userEditPermissions.map((permission, index) => (
  <StyledView
    key={permission.enum}
    className="flex flex-row items-center justify-between gap-x-2 w-full"
  >
    <StyledText className="text-gray-600 text-[13px]">
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
