import { TextType } from "type";
import { useState } from "react";
import { TextForm } from "../form/textForm";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";
import { deleteTextByIdAsync } from "@store/text/textSlice";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
interface TextModalProps {
  text?: TextType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function TextModal({
  isModalOpen,
  setIsModalOpen,
  type,
  text,
}: TextModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.textList.error
  );
  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const deleteItem = await dispatch(deleteTextByIdAsync(text.id));

    if (deleteItem.meta.requestStatus === "fulfilled") {
      showMessage({
        duration: 3000,
        floating: true,
        type: "success",
        position: "bottom",
        message: "Sucesso",
        description:`Texto foi deletado com sucesso!`,
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
      <StyledView className="flex-1 bg-gray-dark pt-5 relative">
        {text && (
          <StyledPressable
            onPress={async () => handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        {text ? (
          <TextForm  text={text} setIsModalOpen={setIsModalOpen} />
        ) : (
          <TextForm setIsModalOpen={setIsModalOpen} />
        )}
      </StyledView>
      <DeleteConfirmationModal
        entity="texto"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
