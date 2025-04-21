import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import { UserOrganizationFlatList } from "./components/user-organization-list";
import {
  fecthOrganizations,
  Organization,
  selectOrganizationAsync,
} from "@store/organization/organizationSlice";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledView,
} from "styledComponents";
import { fecthUserOrganizationByOrganizationId } from "@store/userOrganization/user-organization--slice";
import { SearchFilterListByQueryComponent } from "@components/list/searchFilterListByQuery";
import { VenuePermissionFlatList } from "./components/venues-permission-list";
import { fecthUserPermission } from "@store/user-permission/user-permission-slice";
import { UserOrganizationType } from "type";
import { UserFlatList } from "./components/users-list";
import { deleteUserAsync, fecthUsers } from "@store/userList/user-list-slice";
import { VenueListFlatList } from "./components/venues-list-list";
import { User } from "@store/auth/authSlice";
import { fecthVenues, Venue } from "@store/venue/venueSlice";
import { UserFormComponent } from "./components/users-list/create-user-form";
import Toast from "react-native-simple-toast";
import { Feather } from "@expo/vector-icons";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";

export default function UsersScreen() {
  const queryParams = new URLSearchParams();

  const organization: Organization = useSelector(
    (state: RootState) => state.organizationList.organization
  );

  const [modalVisible, setModalVisible] = useState(false);

  const userOrganization: UserOrganizationType = useSelector(
    (state: RootState) => state.userOrganizationList.userOrganization
  );

  const selectedUser : User = useSelector(
    (state: RootState) => state.userList.selectedUser
  );

  const [formSection, setFormSection] = useState<
    "USER" | "VENUE" | "NEW_USER" | "NEW_VENUE"
  >("USER");

  const [user, setUser] = useState<User>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [createNewUserModal, setCreateNewUserModal] = useState<boolean>(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const deleteItem = await dispatch(
      deleteUserAsync(user.id)
    );

    if (deleteItem.meta.requestStatus === "fulfilled") {
      Toast.show("Usuario deletado com sucesso." as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
      setModalVisible(false)
      setFormSection("NEW_USER")
    }

    if (deleteItem.meta.requestStatus == "rejected") {
      Toast.show("Erro ao deletar usuario.", 3000, {
        backgroundColor: "#FF9494",
        textColor: "white",
      });
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };
 
  return (
    <StyledView className="bg-gray-dark flex-1 pt-5 flex flex-col h-full w-full">
      {user  && formSection === "VENUE" || user && formSection === "NEW_VENUE"  ? (
        <StyledView className="glex flex-row justify-between items-center"> 
          <StyledText className="text-custom-white font-bold text-lg mb-5">
            {user?.username}
          </StyledText>
          <StyledPressable
            className="mb-6"
            onPress={async () => handleDelete()}
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        </StyledView>
      ): null}
      {formSection === "USER" && (
        <>
          <StyledPressable
            onPress={() => setFormSection("NEW_USER")}
            className="
                justify-center items-center bg-green-800 active:scale-95
                rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-2 w-[50%] border-[0.6px] border-white border-solid"
          >
            <StyledText className="text-white text-sm font-bold text-center">
              Adicionar novo usuario
            </StyledText>
          </StyledPressable>
          <SearchFilterListByQueryComponent
            entityId={organization.id}
            queryName="username"
            entityName="organizationId"
            fectData={fecthUserOrganizationByOrganizationId}
            queryParams={queryParams}
          />
          <UserOrganizationFlatList setFormSection={setFormSection} setUser={setUser}/>
        </>
      )}

      {formSection === "NEW_USER" && (
        <StyledView className="h-[90vh]">
          <StyledPressable
            onPress={() => setCreateNewUserModal(true)}
            className="
                justify-center items-center bg-green-800 active:scale-95
                rounded-md px-4 flex flex-row  py-2 shadow-lg ml-[0.25px] mb-2 w-[50%] border-[0.6px] border-white border-solid"
          >
            <StyledText className="text-white text-sm font-bold text-center">
              Criar novo usuario
            </StyledText>
          </StyledPressable>
          <StyledText className="text-custom-gray text-[14px] font-semibold mb-4">
            Selecione um Usuario:
          </StyledText>
          <SearchFilterListByQueryComponent
            entityId={""}
            queryName="username"
            entityName=""
            fectData={fecthUsers}
            queryParams={queryParams}
          />
          <UserFlatList setFormSection={setFormSection} setUser={setUser}/>

          {createNewUserModal && (
            <StyledModal
              visible={createNewUserModal}
              onRequestClose={() => setCreateNewUserModal(false)}
              animationType="fade"
            >
              <UserFormComponent
                setFormSection={setFormSection}
                setIsModalOpen={setCreateNewUserModal}
                setUser={setUser}
              />
            </StyledModal>
          )}
        </StyledView>
      )}

      {formSection === "VENUE"  && (
        <StyledView className="flex flex-col gap-y-1 h-screen relative">
          <StyledText className="text-custom-gray text-[14px] font-semibold mb-4">
            Selecione a Propriedade:
          </StyledText>
          <SearchFilterListByQueryComponent
            queryName="name"
            queryParams={queryParams}
            fectData={fecthUserPermission}
            entityId={userOrganization?.id}
            entityName="userOrganizationId"
          />
          <StyledView className="flex-1">
            <VenuePermissionFlatList setFormSection={setFormSection} />
          </StyledView>
          <StyledView />
        </StyledView>
      )}

      {formSection === "NEW_VENUE" && (
        <StyledView className="flex flex-col gap-y-1 h-screen relative">
          <StyledText className="text-custom-gray text-[14px] font-semibold">
            Selecione a Propriedade:
          </StyledText>
          <StyledView className="flex-1 max-h-64">
            <SearchFilterListByQueryComponent
              queryName="name"
              queryParams={queryParams}
              fectData={fecthVenues}
              entityId={organization?.id}
              entityName="organizationId"
            />
            <VenueListFlatList setFormSection={setFormSection} />
          </StyledView>
          <StyledView />
        </StyledView>
      )}

      <DeleteConfirmationModal
        entity="usuario"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledView>
  );
}
