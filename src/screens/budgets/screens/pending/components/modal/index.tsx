import { Feather,MaterialIcons } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";
import { BugdetType } from "../../../../../../type";
import { deleteOrcamentoByIdAsync } from "../../../../../../store/budget/bugetSlice";
import { AppDispatch, RootState } from "../../../../../../store";
import { BudgetForm } from "../form/budgetForm";

interface BudgetModalProps {
  budget?: BugdetType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BudgetModal({
  isModalOpen,
  setIsModalOpen,
  type,
  budget,
}: BudgetModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.imageList.error
  );
  return (
    <Modal
      visible={isModalOpen}
      onRequestClose={() => setIsModalOpen(false)}
      animationType="fade"
    >
      <View className="flex-1 bg-gray-dark pt-10 relative">
        <Pressable
          className="absolute top-4 left-5"
          onPress={() => setIsModalOpen(false)}
        >
          <MaterialCommunityIcons
            name="arrow-left-thin"
            size={24}
            color="white"
          />
        </Pressable>
        {budget && (
          <Pressable
            onPress={async () => {
              const deleteItem = await dispatch(
                deleteOrcamentoByIdAsync(budget.id)
              );

              if (deleteItem.meta.requestStatus === "fulfilled") {
                Toast.show("Orcamento deletado com sucesso." as string, 3000, {
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
          </Pressable>
        )}
        {budget ? <BudgetForm budget={budget} /> : <BudgetForm />}
      </View>
    </Modal>
  );
}
