import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";

import { QuestionType } from "type";
import { AppDispatch, RootState } from "@store/index";
import { QuestionFormComponent } from "../form/questionForm";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { deleteQuestionByIdAsync } from "@store/question/questionSlice";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
import { useState } from "react";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
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

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const deleteItem = await dispatch(
      deleteQuestionByIdAsync(question.id)
    );

    if (deleteItem.meta.requestStatus === "fulfilled") {
      Toast.show("Pergunta deletada com sucesso." as string, 3000, {
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
        {question && (
          <StyledPressable
            onPress={async () => handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        {question ? (
          <QuestionFormComponent question={question} setIsModalOpen={setIsModalOpen}/>
        ) : (
          <QuestionFormComponent setIsModalOpen={setIsModalOpen}/>
        )}
      </StyledView>
      <DeleteConfirmationModal
        entity="pergunta"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
