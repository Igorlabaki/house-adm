import { StyledScrollView, StyledView } from "styledComponents";
import { AnalysisNavigator } from "./navigator";

export function AnalisisScreen() {
  return (
    <StyledView className="bg-gray-dark flex flex-col min-h-full w-full">
        <AnalysisNavigator />
    </StyledView>
  );
}
