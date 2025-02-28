import { useState } from "react";
import { format } from "date-fns";
import { DocumentType } from "type";
import { DocumentModal } from "../modal";
import { formatCurrency } from "react-native-format-currency";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { Image } from "react-native";

interface ItemFlatListProps {
  document: DocumentType;
}

export function DocumentItemFlatList({ document }: ItemFlatListProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <StyledPressable
      onPress={() => setIsModalOpen(true)}
      delayLongPress={5000}
      key={document?.id}
      className="flex flex-row gap-x-2 items-start justify-start px-5 py-5 bg-[#313338] rounded-md overflow-hidden shadow-lg relative mt-2"
    >
      <StyledView className="overflow-hidden rounded-md">
        <Image
          source={{ uri: document?.imageUrl }} // imagem local
          style={{ width: 50, height: 80 }}
          resizeMode="cover"
        />
      </StyledView>
      <StyledView className=" flex flex-col gap-y-2  items-start justify-between  overflow-hidden overflow-y-auto">
        <StyledView className="flex-row  items-start gap-x-2 text-center">
          <StyledText className="text-[12px] text-white font-bold">
            {document?.title}
          </StyledText>
        </StyledView>
      </StyledView>
      {isModalOpen && (
        <DocumentModal
          type="UPDATE"
          document={document}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </StyledPressable>
  );
}
