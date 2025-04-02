import { ProposalType } from "type";
import { RootState } from "@store/index";
import { useSelector } from "react-redux";
import { StyledText, StyledView } from "styledComponents";

export  function InfoPessoais() {

  const { proposal } : {proposal: ProposalType} = useSelector((state: RootState) => state.proposalList);

  const trafficSource = [
    { display: "Outros", value: "OTHER" },
    { display: "TikTok", value: "TIKTOK" },
    { display: "Amigos", value: "FRIEND" },
    { display: "Google", value: "GOOGLE" },
    { display: "Airbnb", value: "AIRBNB" },
    { display: "Facebook", value: "FACEBOOK" },
    { display: "Instagram", value: "INSTAGRAM" },
  ];

  const renderTrafficSource = () => {
    const  findTraffic = trafficSource.find((item: {display:string,value:string }) => item.value === proposal.trafficSource)
    return(
      <StyledText className="text-[13px] text-white  font-semibold">
         {findTraffic?.display}
      </StyledText>
    )
  }

  return (
    <StyledView className="flex justify-start items-center w-full mt-5">
      <StyledText className="md:text-[21px] w-full  text-[18px] text-center py-5  text-white font-semibold">
        Informacoes Pessoais
      </StyledText>
      <StyledView className="w-[70%] flex-row justify-between items-center mx-auto">
        <StyledText className="text-[13px] text-white  font-semibold">
          Nome :
        </StyledText>
        <StyledText className="text-[13px] text-white  font-semibold">
          {proposal?.completeClientName}
        </StyledText>
      </StyledView>
      <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
        <StyledText className="text-[13px] text-white  font-semibold">
          Email :
        </StyledText>
        <StyledText className="text-[13px] text-white  font-semibold">
          {proposal?.email}
        </StyledText>
      </StyledView>
      <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
        <StyledText className="text-[13px] text-white  font-semibold">
          Whatsapp :
        </StyledText>
        <StyledText className="text-[13px] text-white  font-semibold">
          {proposal?.whatsapp}
        </StyledText>
      </StyledView>
      <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
        <StyledText className="text-[13px] text-white  font-semibold">
          Ja conhece o espaco :
        </StyledText>
        <StyledText className="text-[13px] text-white  font-semibold">
          {proposal?.knowsVenue ? "Sim" : "Nao"}
        </StyledText>
      </StyledView>
      <StyledView className="w-[70%] flex-row justify-between items-center mx-auto mt-1">
        <StyledText className="text-[13px] text-white  font-semibold">
          Por onde nos conheceu :
        </StyledText>
          {renderTrafficSource()}
      </StyledView>
    </StyledView>
  );
}
