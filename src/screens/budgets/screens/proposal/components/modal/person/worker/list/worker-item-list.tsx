import { useState } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { StyledPressable, StyledText, StyledView } from "styledComponents";
import { WorkerType } from "@store/worker/worker-slice";
import { WorkerModal } from "../modal/worker-modal";


interface WorkerItemListProps {
  worker: WorkerType;
}

export function WorkerItemList({ worker }: WorkerItemListProps) {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
 
  return (
    <StyledPressable
      onPress={() => {
        setIsModalOpen(true);
      }}
      delayLongPress={5000}
      key={worker?.id}
      className={`
        flex flex-col items-start justify-start px-5 
        py-5 bg-[#313338] w-full rounded-md overflow-hidden 
        shadow-lg relative
        ${worker?.attendance && "border-[2px] border-green-700"}
        `}
    >
      <StyledView className="flex-row justify-between font-semibold items-center overflow-hidden w-full">
        {worker.attendance && (
          <StyledView className="absolute top-1 right-1">
            <FontAwesome name="check" size={16} color="#15803d" />
          </StyledView>
        )}
        <StyledText className="text-[13px] text-white font-semibold">
          {worker.name}
        </StyledText>
      </StyledView>
      {
        isModalOpen &&
        <WorkerModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          type="UPDATE"
          worker={worker}
        />
      }
    </StyledPressable>
  );
}
