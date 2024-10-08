import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";

import { QuestionType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { QuestionFormComponent } from "../form/questionForm";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { deleteQuestionByIdAsync } from "@store/question/questionSlice";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
interface QuestionModalProps {
  question?: QuestionType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function QuenstionModalComponent({
  question,
  isModalOpen,
  setIsModalOpen,
}: QuestionModalProps) {

  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.questionList.error
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
        {question && (
          <StyledPressable
            onPress={async () => {
              const deleteItem = await dispatch(
                deleteQuestionByIdAsync(question.id)
              );

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
        {question ? (
          <QuestionFormComponent question={question} />
        ) : (
          <QuestionFormComponent />
        )}
      </StyledView>
    </StyledModal>
  );
}
