import React, { useEffect, useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import OrganizationFormModalComponent from "../form";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { OwnerListComponent } from "@components/owners/list";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledView,
} from "styledComponents";
import {
  deleteOrganizationAsync,
  Organization,
} from "@store/organization/organizationSlice";
import { Ionicons, FontAwesome5, FontAwesome6 } from "@expo/vector-icons";
import { OwnerType } from "type";

interface OrganizationMenuProps {
  isModalOpen: boolean;
  setMenuModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OrganizationMenu({
  isModalOpen,
  setMenuModalIsOpen,
}: OrganizationMenuProps) {
  const dispatch = useDispatch<AppDispatch>();

  const organization: Organization = useSelector(
    (state: RootState) => state?.organizationList.organization
  );

  const ownersByOrganization : OwnerType[] = useSelector(
    (state: RootState) => state?.ownerList.ownersByOrganization
  );

  const [modalVisible, setModalVisible] = useState(false);

  const [editOrganizationModalIsOpen, setEditOrganizationModalIsOpen] =
    useState(false);

  const navigation = useNavigation();

  const handleDelete = () => {
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  const confirmDelete = async () => {
    await dispatch(deleteOrganizationAsync(organization.id));
    setMenuModalIsOpen(false);
    navigation.navigate("OrganizationList");
  };

  const navigateToOwnerScreen = () => {
    navigation.navigate("OwnersScreen", { type: "ORGANIZATION"});
  };

  const navigateToContractScreen = () => {
    navigation.navigate("ContractScreen");
  };

  return (
    <StyledModal
      visible={isModalOpen}
      transparent={true}
      onRequestClose={() => {
        setMenuModalIsOpen(false);
      }}
      animationType="slide"
    >
      <StyledView
        className={"flex-1 justify-center items-center bg-transparent"}
      >
        <StyledView className={"w-4/5 bg-gray-900 rounded-lg p-6 items-center"}>
          <StyledPressable
            className="absolute top-2 right-2"
            onPress={() => setMenuModalIsOpen(false)}
          >
            <Ionicons name="close" size={16} color="white" />
          </StyledPressable>
          <StyledPressable
            className="bg-gray-ligth  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
            onPress={() => setEditOrganizationModalIsOpen(true)}
          >
            <StyledText className="text-white font-bold text-start w-[130px]">
              Editar Organizacao
            </StyledText>
            <FontAwesome6 name="edit" size={18} color="white" />
          </StyledPressable>
          <StyledPressable
            className="bg-gray-ligth  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
            onPress={() =>{ 
              navigateToOwnerScreen()
              setMenuModalIsOpen(false)
            }}
          >
            <StyledText className="text-white font-bold text-start w-[130px]">
              Proprietarios
            </StyledText>
            <Feather name="users" size={20} color="white" />
          </StyledPressable>
          <StyledPressable
            className="bg-gray-ligth  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
            onPress={() =>{ 
              navigateToContractScreen()
              setMenuModalIsOpen(false)
            }}
          >
            <StyledText className="text-white font-bold text-start w-[130px]">
              Contratos
            </StyledText>
            <Feather name="file-text" size={20} color="white" />
          </StyledPressable>
          <StyledPressable
            className="bg-gray-ligth  px-5 flex flex-row justify-between gap-x-3 rounded-md mt-4 w-[90%] mx-auto py-3  items-center"
            onPress={() => handleDelete()}
          >
            <StyledText className="text-white font-bold text-start w-[130px]">
              Deletar Organizacao
            </StyledText>
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        </StyledView>
      </StyledView>
      <DeleteConfirmationModal
        entity="organizacao"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      {editOrganizationModalIsOpen && (
        <OrganizationFormModalComponent
          organization={organization}
          isModalOpen={editOrganizationModalIsOpen}
          setMenuModalIsOpen={setEditOrganizationModalIsOpen}
        />
      )}
    </StyledModal>
  );
}
