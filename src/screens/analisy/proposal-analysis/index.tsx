import React, { useState } from "react";
import { StyledText, StyledView } from "styledComponents";

export default function ProposalAnalysisScreen() {


  const queryParams = new URLSearchParams();
  const visitaQueryParams = new URLSearchParams();
  return (
    <StyledView className="bg-gray-dark flex-1 pt-5 flex flex-col h-full w-full">
      <StyledText>proposal</StyledText>
    </StyledView>
  );
}
