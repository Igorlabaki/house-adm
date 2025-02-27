import { ImageType } from "type";
import { useState } from "react";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { CreateImageForm } from "../form/create-form";
import { UpdateImageForm } from "../form/update-form";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { deleteImageByIdAsync } from "@store/image/imagesSlice";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
interface TextModalProps {
  image?: ImageType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ImageModal({
  isModalOpen,
  image,
  setIsModalOpen,
}: TextModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const response = await dispatch(deleteImageByIdAsync(image.id));

    if (response.meta.requestStatus === "fulfilled") {
      Toast.show(response.payload.message, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
    }

    if (response.meta.requestStatus == "rejected") {
      Toast.show(response.payload as string, 3000, {
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
        {image && (
          <StyledPressable
            onPress={async () => handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        {image ? <UpdateImageForm imageItem={image}  setIsModalOpen={setIsModalOpen}/> : <CreateImageForm setIsModalOpen={setIsModalOpen}/>}
      </StyledView>
      <DeleteConfirmationModal
        entity="imagem"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
