import { TextForm } from "../form/textForm";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { TextType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { deleteTextByIdAsync } from "@store/text/textSlice";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
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
        {text && (
          <StyledPressable
            onPress={async () => {
              const deleteItem = await dispatch(deleteTextByIdAsync(text.id));

              if (deleteItem.meta.requestStatus === "fulfilled") {
                Toast.show("Text deleted successfully." as string, 3000, {
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
        {text ? <TextForm text={text} /> : <TextForm />}
      </StyledView>
    </StyledModal>
  );
}
