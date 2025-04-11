import { useState } from "react";
import { ContactType } from "type";
import { Linking } from "react-native";
import Toast from "react-native-simple-toast";
import { ContactFormComponent } from "../form/form";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { Feather, Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { deleteContactByIdAsync } from "@store/contact/contact-slice";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import {
  StyledModal,
  StyledPressable,
  StyledText,
  StyledView,
} from "styledComponents";

interface ContactModalProps {
  contact?: ContactType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ContactModalComponent({
  contact,
  isModalOpen,
  setIsModalOpen,
}: ContactModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.contactList.error
  );

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const deleteItem = await dispatch(deleteContactByIdAsync(contact.id));

    if (deleteItem.meta.requestStatus === "fulfilled") {
      Toast.show("Contato deletado com sucesso." as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
    }

    if (deleteItem.meta.requestStatus == "rejected") {
      Toast.show(error as string, 3000, {
        backgroundColor: "#FF9494",
        textColor: "white",
      });
    }
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      animationType="fade"
    >
      <StyledView className="flex-1 bg-gray-dark pt-10 relative">
        {contact && (
          <StyledPressable
            onPress={async () => handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        {contact ? (
          <ContactFormComponent
            contact={contact}
            setIsModalOpen={setIsModalOpen}
          />
        ) : (
          <ContactFormComponent setIsModalOpen={setIsModalOpen} />
        )}
        {contact && (
          <StyledPressable
            className="bg-blue-800 px-5  flex flex-row justify-center gap-x-2 rounded-md w-[90%] mx-auto py-3 mt-2"
            onPress={() => {
              const formattedNumber = `+55${contact.whatsapp
                .replace("-", "")
                .replace(/[\s()]/g, "")}`;
              const whatsappURL = `https://api.whatsapp.com/send/?phone=${formattedNumber}&type=phone_number&app_absent=0`;
              Linking.openURL(whatsappURL).catch((err) =>
                console.error("Erro ao abrir o WhatsApp:", err)
              );
            }}
          >
            <StyledText className="text-white font-bold text-start ">
              Entrar em contato
            </StyledText>
            <MaterialCommunityIcons name="whatsapp" size={20} color="white" />
          </StyledPressable>
        )}
      </StyledView>
      <DeleteConfirmationModal
        entity="contato"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
