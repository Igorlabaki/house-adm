import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { BugdetType } from "type";
import { BudgetForm } from "../form/budgetForm";
import { AppDispatch, RootState } from "@store/index";
import { deleteOrcamentoByIdAsync } from "@store/budget/bugetSlice";
import {
  StyledModal,
  StyledPressable,
  StyledScrollView,
  StyledView,
} from "styledComponents";
import { KeyboardAvoidingView, Platform } from "react-native";
interface BudgetModalProps {
  budget?: BugdetType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BudgetModal({
  budget,
  isModalOpen,
  setIsModalOpen,
}: BudgetModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const error = useSelector<RootState>(
    (state: RootState) => state.imageList.error
  );
  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => {
        setIsModalOpen(false);
      }}
      animationType="fade"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <StyledScrollView>
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
            {budget && (
              <StyledPressable
                onPress={async () => {
                  const deleteItem = await dispatch(
                    deleteOrcamentoByIdAsync(budget.id)
                  );

                  if (deleteItem.meta.requestStatus === "fulfilled") {
                    Toast.show(
                      "Orcamento deletado com sucesso." as string,
                      3000,
                      {
                        backgroundColor: "rgb(75,181,67)",
                        textColor: "white",
                      }
                    );
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
            {budget ? <BudgetForm budget={budget} /> : <BudgetForm />}
          </StyledView>
        </StyledScrollView>
      </KeyboardAvoidingView>
    </StyledModal>
  );
}
