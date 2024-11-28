import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { BugdetType } from "type";
import { BudgetForm } from "../form/budgetForm";
import { AppDispatch, RootState } from "@store/index";
import {
  StyledModal,
  StyledPressable,
  StyledSafeAreaView,
  StyledScrollView,
  StyledView,
} from "styledComponents";
import { KeyboardAvoidingView, Platform } from "react-native";
import { deleteOrcamentoAprovadoByIdAsync } from "@store/budgetAprovado/bugetAprovadoSlice";
import { useEffect, useState } from "react";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import {
  deleteOrcamentoByIdAsync,
  getOrcamentoByIdAsync,
} from "@store/budget/bugetSlice";
import { fetchNotificationsList } from "@store/notifications/notificationsSlice";
interface BudgetModalProps {
  budget?: BugdetType;
  isModalOpen: boolean;
  type: "CREATE" | "UPDATE";
  setIsInfoModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsEditModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function BudgetModal({
  budget,
  type,
  isModalOpen,
  setIsEditModalOpen,
  setIsInfoModalOpen,
}: BudgetModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector<RootState>(
    (state: RootState) => state.imageList.error
  );

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const { orcamento } = useSelector((state: RootState) => state.orcamentosById);

  const confirmDelete = async () => {
    if (orcamento?.aprovadoCliente === true && orcamento?.aprovadoAr756 === true) {
      const deleteItemAprovado = await dispatch(
        deleteOrcamentoAprovadoByIdAsync(orcamento.id)
      );
      if (deleteItemAprovado.meta.requestStatus === "fulfilled") {
        dispatch(fetchNotificationsList())
        Toast.show("Orcamento deletado com sucesso." as string, 3000, {
          backgroundColor: "rgb(75,181,67)",
          textColor: "white",
        });
        setIsEditModalOpen(false);
        setIsInfoModalOpen(false);
      }

      if (deleteItemAprovado.meta.requestStatus == "rejected") {
        Toast.show(error as string, 3000, {
          backgroundColor: "#FF9494",
          textColor: "white",
        });
      }
    } else {
      const deleteItem = await dispatch(deleteOrcamentoByIdAsync(orcamento.id));
      if (deleteItem.meta.requestStatus === "fulfilled") {
        dispatch(fetchNotificationsList())
        Toast.show("Orcamento deletado com sucesso." as string, 3000, {
          backgroundColor: "rgb(75,181,67)",
          textColor: "white",
        });
        setIsEditModalOpen(false);
        setIsInfoModalOpen(false);
      }

      if (deleteItem.meta.requestStatus == "rejected") {
        Toast.show(error as string, 3000, {
          backgroundColor: "#FF9494",
          textColor: "white",
        });
      }
    }
    setModalVisible(false);
  };

  const cancelDelete = () => {
    setModalVisible(false);
  };

  return (
    <StyledModal
      visible={isModalOpen}
      onRequestClose={() => {
        setIsEditModalOpen(false);
      }}
      animationType="fade"
    >
      <StyledSafeAreaView>
        <StyledScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <StyledView className="flex-1 bg-gray-dark pt-10 relative pb-16">
            <StyledPressable
              className="absolute top-4 left-5"
              onPress={() => setIsEditModalOpen(false)}
            >
              <MaterialCommunityIcons name="close" size={18} color="white" />
            </StyledPressable>
            <StyledPressable
              onPress={async () => handleDelete()}
              className="absolute top-5 right-5"
            >
              <Feather name="trash" size={16} color="white" />
            </StyledPressable>
            {budget && (
              <StyledPressable
                onPress={async () => {
                  handleDelete();
                }}
                className="absolute top-5 right-5"
              >
                <Feather name="trash" size={16} color="white" />
              </StyledPressable>
            )}
            {type === "UPDATE" ? (
              <BudgetForm
                setIsEditModalOpen={setIsEditModalOpen}
                orcamento={orcamento}
              />
            ) : (
              <BudgetForm setIsEditModalOpen={setIsEditModalOpen} />
            )}
          </StyledView>
        </StyledScrollView>
      </StyledSafeAreaView>
      <DeleteConfirmationModal
        entity="orcamento"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
