
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledView,
} from "styledComponents";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@store/index";
import {
  Feather,
  FontAwesome5,
  FontAwesome6,
  Ionicons,
} from "@expo/vector-icons";

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { deleteVenueAsync, Venue } from "@store/venue/venueSlice";
import { VenueFormModalComponent } from "@components/venue/form";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { OwnerType } from "type";

interface VenueMenuProps {
  isModalOpen: boolean;
  setMenuModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function VenueMenu({
  isModalOpen,
  setMenuModalIsOpen,
}: VenueMenuProps) {
  const dispatch = useDispatch<AppDispatch>();

  const venue : Venue = useSelector(
    (state: RootState) => state?.venueList.venue
  );

  const ownersByVenue : OwnerType[] = useSelector(
    (state: RootState) => state?.ownerList.ownersByVenue
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [editVenueIsOpen, setEditVenueIsOpen] =
    useState(false);
  const navigation = useNavigation();

  const handleDelete = () => {
    setModalVisible(true);
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  const confirmDelete = async () => {
    await dispatch(deleteVenueAsync(venue.id));
    setMenuModalIsOpen(false);
    navigation.navigate("OrganizationList");
  };


  const navigateToOwnerScreen = () => {
    navigation.navigate("OwnersScreen", { type: "VENUE"});
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
            onPress={() => setEditVenueIsOpen(true)}
          >
            <StyledText className="text-white font-bold text-start w-[130px]">
              Editar Locacao
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
            onPress={() => handleDelete()}
          >
            <StyledText className="text-white font-bold text-start w-[130px]">
              Deletar Locacao
            </StyledText>
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        </StyledView>
      </StyledView>
      <DeleteConfirmationModal
        entity="Locacao"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
      {editVenueIsOpen && (
        <VenueFormModalComponent
          venue={venue}
          isModalOpen={editVenueIsOpen}
          setMenuModalIsOpen={setEditVenueIsOpen}
        />
      )}
    </StyledModal>
  );
}
