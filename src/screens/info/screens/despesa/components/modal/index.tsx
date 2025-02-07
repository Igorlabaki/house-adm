import { useState } from "react";
import { ExpenseForm } from "../form";
import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { AppDispatch, RootState } from "@store/index";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyledModal, StyledPressable, StyledView } from "styledComponents";
import { deleteExpenseByIdAsync, ExpenseType } from "@store/expense/expenseSlice";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";

interface ExpenseModalProps {
  expense?: ExpenseType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ExpenseModal({
  expense,
  isModalOpen,
  setIsModalOpen,
}: ExpenseModalProps) {

  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector<RootState>(
    (state: RootState) => state.expenseList.error
  );

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const response = await dispatch(deleteExpenseByIdAsync(expense.id));

    if (response.meta.requestStatus === "fulfilled") {
      Toast.show(response.payload.message as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
    }

    if (response.meta.requestStatus == "rejected") {
      Toast.show(response.payload.message as string, 3000, {
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
        {expense && (
          <StyledPressable
            onPress={async () =>handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        {expense ? <ExpenseForm expense={expense} setIsModalOpen={setIsModalOpen}/> : <ExpenseForm setIsModalOpen={setIsModalOpen}/>}
      </StyledView>
      <DeleteConfirmationModal
        entity="expense"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
