import { Feather } from "@expo/vector-icons";
import Toast from "react-native-simple-toast";
import { useDispatch, useSelector } from "react-redux";
import { MaterialCommunityIcons } from "@expo/vector-icons";


import { ServiceForm } from "../form/service-form";
import { AppDispatch, RootState } from "@store/index";

import { StyledModal, StyledPressable, StyledView } from "styledComponents";
import { useState } from "react";
import { DeleteConfirmationModal } from "@components/list/deleteConfirmationModal";
import { deleteServiceByIdAsync, ServiceType } from "@store/service/service-slice";
interface ServiceModalProps {
  isModalOpen: boolean;
  service?: ServiceType;
  type: "CREATE" | "UPDATE";
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function ServiceModal({
  service,
  isModalOpen,
  setIsModalOpen,
}: ServiceModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const error = useSelector<RootState>(
    (state: RootState) => state.textList.error
  );

  const [modalVisible, setModalVisible] = useState(false);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const confirmDelete = async () => {
    const response = await dispatch(deleteServiceByIdAsync(service?.id));

    if (response.meta.requestStatus === "fulfilled") {
      Toast.show("Servico deletedo com sucesso." as string, 3000, {
        backgroundColor: "rgb(75,181,67)",
        textColor: "white",
      });
      setModalVisible(false);
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
        {service && (
          <StyledPressable
            onPress={async () => handleDelete()}
            className="absolute top-5 right-5"
          >
            <Feather name="trash" size={16} color="white" />
          </StyledPressable>
        )}
        {service ? (
          <ServiceForm service={service} setIsModalOpen={setIsModalOpen} />
        ) : (
          <ServiceForm setIsModalOpen={setIsModalOpen} />
        )}
      </StyledView>
      <DeleteConfirmationModal
        entity="valor"
        visible={modalVisible}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </StyledModal>
  );
}
