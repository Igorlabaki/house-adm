import { StyledView } from "styledComponents";
import { AnalysisNavigator } from "./navigator";

export function AnalisisScreen() {
  return (
    <StyledView className="bg-gray-dark flex-1 flex flex-col h-full w-full">
        <AnalysisNavigator />
    </StyledView>
  );
}
