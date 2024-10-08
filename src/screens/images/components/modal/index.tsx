import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ImageType } from "type";
import { ImageForm } from "../form/imageForm";
import { AppDispatch, RootState } from "@store/index";
import { deleteImageByIdAsync } from "@store/image/imagesSlice";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";

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
  const error = useSelector<RootState>(
    (state: RootState) => state.imageList.error
  );
  
  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      animationType="fade"
    >
      <StyledView className="flex-1 bg-gray-dark pt-10 relative">
        <StyledPressable
          className="absolute top-4 left-5"
          onPress={() => setIsModalOpen(false)}
        >
          <MaterialCommunityIcons
            name="arrow-left-thin"
            size={24}
            color="white"
          />
        </StyledPressable>
        {image && (
          <StyledPressable
            onPress={async () => {
              const deleteItem = await dispatch(deleteImageByIdAsync(image.id));

              if (deleteItem.meta.requestStatus === "fulfilled") {
                Toast.show("Image deleted successfully." as string, 3000, {
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
            }}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        {image ? <ImageForm image={image} /> : <ImageForm />}
      </StyledView>
    </StyledModal>
  );
}
