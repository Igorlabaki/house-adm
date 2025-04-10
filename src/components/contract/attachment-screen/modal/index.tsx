import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";

import { AttachmentType } from "type";
import { AppDispatch, RootState } from "@store/index";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledView,
} from "styledComponents";
import { useState } from "react";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { AttachmentFormComponent } from "../form";
import { deleteAttachmentByIdAsync } from "@store/attachment/attachment-slice";
interface AttachmentModalProps {
  attachment?: AttachmentType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AttachmentModalComponent({
  attachment,
  isModalOpen,
  setIsModalOpen,
}: AttachmentModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.attachmentState.error
  );

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const deleteItem = await dispatch(deleteAttachmentByIdAsync(attachment.id));

    if (deleteItem.meta.requestStatus === "fulfilled") {
      Toast.show("Anexo deletada com sucesso." as string, 3000, {
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
      <StyledScrollView>
        <StyledView className="flex-1 bg-gray-dark pt-5 pb-10 h-screen relative">
          {attachment && (
            <StyledPressable
              onPress={async () => handleDelete()}
              className="absolute top-4 right-5"
            >
              <Feather name="trash" size={16} color="white" />
            </StyledPressable>
          )}
          {attachment ? (
            <AttachmentFormComponent
              attachment={attachment}
              setIsModalOpen={setIsModalOpen}
            />
          ) : (
            <AttachmentFormComponent setIsModalOpen={setIsModalOpen} />
          )}
        </StyledView>
      </StyledScrollView>
      <DeleteConfirmationModal
        entity="anexo"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
